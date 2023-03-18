import { assert } from "assert";
import { getMostSignificantBits } from "../bitManipulation.ts";
import {
  encase,
  getReg,
  getRegistersForMemReg,
  getRm,
  joinAddress,
  Mode,
  RM_SPECIAL_CASE_DIRECT_ADDRESS,
  rmToRegister,
} from "../common.ts";
import { ExtractSignedByte, ExtractSignedTwoBytes } from "../decode.ts";
import { MoveDecoder } from "./decode.ts";
import { movWithDFlag } from "./move.ts";

const parseRegAndRm = (
  b1: number,
  b2: number,
): [reg: string, rm: string] => {
  const reg = getReg(b2);
  const rm = getRm(b2);
  const registers = getRegistersForMemReg(b1);
  return [registers[reg], rmToRegister[rm]];
};

const withAddressCalculation2 = (b1: number, b2: number) => {
  const [regStr, rmStr] = parseRegAndRm(b1, b2);

  return movWithDFlag(b1, regStr, joinAddress(rmStr), 2);
};

const withAddressCalculation3 = (
  b1: number,
  b2: number,
  nom8: ExtractSignedByte,
  pointer: number,
) => {
  const [reg, rm] = parseRegAndRm(b1, b2);

  const v = nom8(pointer + 2);

  return movWithDFlag(b1, reg, joinAddress(rm, v), 3);
};

const withAddressCalculation4 = (
  b1: number,
  b2: number,
  nom16: ExtractSignedTwoBytes,
  pointer: number,
) => {
  const [reg, rm] = parseRegAndRm(b1, b2);

  const twoByte = nom16(pointer + 2);

  return movWithDFlag(b1, reg, joinAddress(rm, twoByte), 4);
};

const specialCaseDirectAddress = (
  b1: number,
  b2: number,
  nom16: ExtractSignedTwoBytes,
  pointer: number,
) => {
  const [reg] = parseRegAndRm(b1, b2);

  const twoByte = nom16(pointer + 2);

  return movWithDFlag(b1, reg, encase(String(twoByte)), 4);
};

export const regMemory: MoveDecoder = (asm, p, nom8, nom16) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];

  const mode = getMostSignificantBits(b2, 6);
  assert(mode in Mode);

  switch (mode) {
    case Mode.REGISTER: {
      const reg = getReg(b2);
      const rm = getRm(b2);
      const registers = getRegistersForMemReg(b1);
      return movWithDFlag(b1, registers[reg], registers[rm], 2);
    }
    case Mode.MEMORY_NO_DISPLACEMENT: {
      const rm = getRm(b2);
      if (rm === RM_SPECIAL_CASE_DIRECT_ADDRESS) {
        return specialCaseDirectAddress(b1, b2, nom16, p);
      }
      return withAddressCalculation2(b1, b2);
    }
    case Mode.MEMORY_8_DISPLACEMENT:
      return withAddressCalculation3(b1, b2, nom8, p);
    case Mode.MEMORY_16_DISPLACEMENT:
      return withAddressCalculation4(b1, b2, nom16, p);
  }
  throw new Error(`${mode} not found`);
};
