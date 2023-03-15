import { assert } from "assert";
import {
  getBit,
  getMostSignificantBits,
  twoByteNumber,
} from "../bitManipulation.ts";
import {
  Decoder,
  getRm,
  joinAddress,
  Mode,
  RM_SPECIAL_CASE_DIRECT_ADDRESS,
  rmToRegister,
  W,
} from "./common.ts";

const immediateAndConsumed = (
  immediateIsWord: number,
  asm: Uint8Array,
  pointer: number,
  offsetToImmediate: number,
) => {
  const immediatePointer = pointer + offsetToImmediate;
  const lsb = asm[immediatePointer];
  const msb = asm[immediatePointer + 1];
  const immediate = immediateIsWord
    ? `word ${twoByteNumber(lsb, msb)}`
    : `byte ${lsb}`;

  const consumed = offsetToImmediate + 1 + immediateIsWord;
  return [immediate, consumed] as const;
};

export const immToMemReg: Decoder = (asm, p, nom8, nom16) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];

  const WORD = getBit(b1, 0);

  const mode = getMostSignificantBits(b2, 6);
  assert(mode in Mode);

  const rm = getRm(b2);
  switch (mode) {
    case Mode.REGISTER: {
      const registers = W[WORD];
      const [immediate, consumed] = immediateAndConsumed(WORD, asm, p, 2);
      return [`mov ${registers[rm]}, ${immediate}`, consumed];
    }
    case Mode.MEMORY_NO_DISPLACEMENT: {
      if (rm === RM_SPECIAL_CASE_DIRECT_ADDRESS) {
        throw new Error();
      }
      const [immediate, consumed] = immediateAndConsumed(WORD, asm, p, 2);
      return [
        `mov ${joinAddress(rmToRegister[rm])}, ${immediate}`,
        consumed,
      ];
    }
    case Mode.MEMORY_8_DISPLACEMENT: {
      const disp = p + 2;
      const [immediate, consumed] = immediateAndConsumed(WORD, asm, p, 3);
      return [
        `mov ${joinAddress(rmToRegister[rm], nom8(disp))}, ${immediate}`,
        consumed,
      ];
    }
    case Mode.MEMORY_16_DISPLACEMENT: {
      const disp = p + 2;
      const [immediate, consumed] = immediateAndConsumed(WORD, asm, p, 4);

      return [
        `mov ${joinAddress(rmToRegister[rm], nom16(disp))}, ${immediate}`,
        consumed,
      ];
    }
  }
  throw new Error(`${mode} not found`);
};
