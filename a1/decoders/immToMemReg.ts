import { assert } from "assert";
import {
  getBit,
  getMostSignificantBits,
  twoByteNumber,
} from "../bitManipulation.ts";
import {
  getRm,
  joinAddress,
  Mode,
  RM_SPECIAL_CASE_DIRECT_ADDRESS,
  rmToRegister,
  W,
} from "./common.ts";
import { Decoder } from "./decode.ts";
import { MOV } from "./move.ts";

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
      return MOV(registers[rm], ...immediateAndConsumed(WORD, asm, p, 2));
    }
    case Mode.MEMORY_NO_DISPLACEMENT: {
      if (rm === RM_SPECIAL_CASE_DIRECT_ADDRESS) {
        throw new Error();
      }

      return MOV(
        joinAddress(rmToRegister[rm]),
        ...immediateAndConsumed(WORD, asm, p, 2),
      );
    }
    case Mode.MEMORY_8_DISPLACEMENT: {
      return MOV(
        joinAddress(rmToRegister[rm], nom8(p + 2)),
        ...immediateAndConsumed(WORD, asm, p, 3),
      );
    }
    case Mode.MEMORY_16_DISPLACEMENT:
      return MOV(
        joinAddress(rmToRegister[rm], nom16(p + 2)),
        ...immediateAndConsumed(WORD, asm, p, 4),
      );
  }
  throw new Error(`${mode} not found`);
};
