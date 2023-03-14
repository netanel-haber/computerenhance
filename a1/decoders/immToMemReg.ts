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
      const third = asm[p + 2];
      const immediate = WORD
        ? `word ${twoByteNumber(third, asm[p + 3])}`
        : `byte ${third}`;
      return [`mov ${registers[rm]}, ${immediate}`, WORD ? 4 : 3];
    }
    case Mode.MEMORY_NO_DISPLACEMENT: {
      if (rm === RM_SPECIAL_CASE_DIRECT_ADDRESS) {
        throw new Error();
      }
      const third = asm[p + 2];
      const immediate = WORD
        ? `word ${twoByteNumber(third, asm[p + 3])}`
        : `byte ${third}`;
      return [
        `mov ${joinAddress(rmToRegister[rm])}, ${immediate}`,
        WORD ? 4 : 3,
      ];
    }
    case Mode.MEMORY_8_DISPLACEMENT: {
      const fourth = asm[p + 3];
      const immediate = WORD
        ? `word ${twoByteNumber(fourth, asm[p + 4])}`
        : `byte ${fourth}`;
      const displacement = nom8(p + 2);
      return [
        `mov ${joinAddress(rmToRegister[rm], displacement)}, ${immediate}`,
        WORD ? 5 : 4,
      ];
    }
    case Mode.MEMORY_16_DISPLACEMENT: {
      const fifth = asm[p + 4];
      const immediate = WORD
        ? `word ${twoByteNumber(fifth, asm[p + 5])}`
        : `byte ${fifth}`;
      const displacement = nom16(p + 2);
      return [
        `mov ${joinAddress(rmToRegister[rm], displacement)}, ${immediate}`,
        WORD ? 6 : 5,
      ];
    }
  }
  throw new Error(`${mode} not found`);
};
