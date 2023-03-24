import { assert } from "assert";
import {
  bitOn,
  getBit,
  getMostSignificantBits,
  sext,
  twoByteNumber,
} from "../bitManipulation.ts";
import {
  getRm,
  joinAddress,
  Mode,
  RM_SPECIAL_CASE_DIRECT_ADDRESS,
  rmToRegister,
  W,
} from "../common.ts";
import { MoveDecoder } from "./types.ts";
import { MOV } from "./render.ts";
import { Decoder } from "../decode.ts";

export const immediateAndConsumed = (
  immediateIsWord: number,
  asm: Uint8Array,
  pointer: number,
  offsetToImmediate: number,
  signExtend: boolean,
) => {
  const immediatePointer = pointer + offsetToImmediate;
  const lsb = asm[immediatePointer];
  const msb = asm[immediatePointer + 1];
  const immediate = immediateIsWord
    ? `word ${twoByteNumber(lsb, msb)}`
    : `byte ${signExtend ? sext(lsb) : lsb}`;

  const consumed = offsetToImmediate + 1 + immediateIsWord;
  return [immediate, consumed] as const;
};

export const immToMemReg: (
  ...args: Parameters<Decoder>
) => [register: string, immediate: string, consumed: number] = (
  asm,
  p,
  nom8,
  nom16,
) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];

  const WORD = getBit(b1, 0);

  const mode: Mode = getMostSignificantBits(b2, 6);
  assert(mode in Mode);

  const rm = getRm(b2);
  switch (mode) {
    case Mode.REGISTER:
      return [W[WORD][rm], ...immediateAndConsumed(WORD, asm, p, 2, false)];
    case Mode.MEMORY_NO_DISPLACEMENT:
      if (rm === RM_SPECIAL_CASE_DIRECT_ADDRESS) {
        throw new Error("RM_SPECIAL_CASE_DIRECT_ADDRESS");
      }
      return [
        joinAddress(rmToRegister[rm]),
        ...immediateAndConsumed(WORD, asm, p, 2, false),
      ];

    case Mode.MEMORY_8_DISPLACEMENT:
      return [
        joinAddress(rmToRegister[rm], nom8(p + 2)),
        ...immediateAndConsumed(WORD, asm, p, 3, bitOn(b1, 1)),
      ];

    case Mode.MEMORY_16_DISPLACEMENT:
      return [
        joinAddress(rmToRegister[rm], nom16(p + 2)),
        ...immediateAndConsumed(WORD, asm, p, 4, false),
      ];
  }
};

export const movImmToMemReg: MoveDecoder = (asm, p, nom8, nom16, _) =>
  MOV(...immToMemReg(asm, p, nom8, nom16, _));
