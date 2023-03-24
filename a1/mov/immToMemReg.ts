import { assert } from "assert";
import {
  bitOn,
  getBit,
  getMostSignificantBits,
  sext,
  twoByteNumber,
} from "../bitManipulation.ts";
import {
  encase,
  getRm,
  joinAddress,
  Mode,
  RM_SPECIAL_CASE_DIRECT_ADDRESS,
  rmToRegister,
  W,
} from "../common.ts";
import { MoveDecoder } from "./types.ts";
import { MOV } from "./render.ts";
import { DecoderArgs } from "../decode.ts";

export const immediateAndConsumed = (
  asm: Uint8Array,
  pointer: number,
  offsetToImmediate: number,
  word: number,
  signExtend: boolean,
) => {
  const immediatePointer = pointer + offsetToImmediate;
  const lsb = asm[immediatePointer];
  const msb = asm[immediatePointer + 1];

  if (word && signExtend) {
    return [`word ${sext(lsb)}`, offsetToImmediate + 1] as const;
  }

  const immediate = word ? `word ${twoByteNumber(lsb, msb)}` : `byte ${lsb}`;

  const consumed = offsetToImmediate + 1 + word;
  return [immediate, consumed] as const;
};

export const immToMemReg = (
  { asm, p, nom8, nom16 }: DecoderArgs,
  signExtend: boolean,
): [register: string, immediate: string, consumed: number] => {
  const b1 = asm[p];
  const b2 = asm[p + 1];

  const WORD = getBit(b1, 0);
  const SIGN_EXTEND = signExtend && bitOn(b1, 1);

  const mode: Mode = getMostSignificantBits(b2, 6);
  assert(mode in Mode);

  const rm = getRm(b2);
  switch (mode) {
    case Mode.REGISTER:
      return [
        W[WORD][rm],
        ...immediateAndConsumed(asm, p, 2, WORD, SIGN_EXTEND),
      ];
    case Mode.MEMORY_NO_DISPLACEMENT:
      if (rm === RM_SPECIAL_CASE_DIRECT_ADDRESS) {
        return [
          encase(nom16(p + 2)),
          ...immediateAndConsumed(asm, p, 4, WORD, SIGN_EXTEND),
        ];
      }
      return [
        joinAddress(rmToRegister[rm]),
        ...immediateAndConsumed(asm, p, 2, WORD, SIGN_EXTEND),
      ];

    case Mode.MEMORY_8_DISPLACEMENT:
      return [
        joinAddress(rmToRegister[rm], nom8(p + 2)),
        ...immediateAndConsumed(asm, p, 3, WORD, SIGN_EXTEND),
      ];

    case Mode.MEMORY_16_DISPLACEMENT:
      return [
        joinAddress(rmToRegister[rm], nom16(p + 2)),
        ...immediateAndConsumed(asm, p, 4, WORD, SIGN_EXTEND),
      ];
  }
};

export const movImmToMemReg: MoveDecoder = (args) =>
  MOV(...immToMemReg(args, false));
