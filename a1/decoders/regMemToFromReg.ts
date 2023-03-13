import { assert, assertNotEquals } from "assert";
import {
  getBit,
  getBits,
  getMostSignificantBits,
  twoByteNumber,
} from "../bitManipulation.ts";
import { Decoder, MOV, W } from "./common.ts";

const getRegistersForMemReg = (b1: number) => W[getBit(b1, 0)];

const getReg = (b2: number) => getBits(b2, 5, 3);
const getRm = (b2: number) => getBits(b2, 2, 0);
const rmToRegister = [
  ["bx", "si"],
  ["bx", "di"],
  ["bp", "si"],
  ["bp", "di"],
  ["si"],
  ["di"],
  ["bp"],
  ["bx"],
];

const joinAddress = (rmStr: readonly string[]) => `[${rmStr.join(" + ")}]`;

const parseRegAndRm = (
  b1: number,
  b2: number,
): [reg: string, rm: readonly string[]] => {
  const reg = getReg(b2);
  const rm = getRm(b2);
  const registers = getRegistersForMemReg(b1);
  return [registers[reg], rmToRegister[rm]];
};

const withAddressCalculation2 = (b1: number, b2: number) => {
  const [regStr, rmStr] = parseRegAndRm(b1, b2);

  return MOV(
    b1,
    regStr,
    joinAddress(rmStr),
    2,
  );
};

const withAddressCalculation3 = (b1: number, b2: number, b3: number) => {
  const [reg, rm] = parseRegAndRm(b1, b2);

  return MOV(
    b1,
    reg,
    joinAddress(rm.concat(b3 ? [String(b3)] : [])),
    3,
  );
};

const withAddressCalculation4 = (
  b1: number,
  b2: number,
  b3: number,
  b4: number,
) => {
  const [reg, rm] = parseRegAndRm(b1, b2);

  const twoByte = twoByteNumber(b3, b4);

  return MOV(
    b1,
    reg,
    joinAddress(rm.concat(twoByte ? [String(twoByte)] : [])),
    4,
  );
};

const specialCaseDirectAddress = (
  b1: number,
  b2: number,
  b3: number,
  b4: number,
) => {
  const [reg] = parseRegAndRm(b1, b2);

  const twoByte = twoByteNumber(b3, b4);

  return MOV(
    b1,
    reg,
    joinAddress([String(twoByte)]),
    4,
  );
};

const RM_SPECIAL_CASE_DIRECT_ADDRESS = 0b110;

enum Mode {
  MEMORY_NO_DISPLACEMENT = 0b00,
  MEMORY_8_DISPLACEMENT = 0b01,
  MEMORY_16_DISPLACEMENT = 0b10,
  REGISTER = 0b11,
}
export const regMemory: Decoder = (asm, p) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];

  const mode = getMostSignificantBits(b2, 6);
  assert(mode in Mode);

  switch (mode) {
    case Mode.REGISTER: {
      const reg = getReg(b2);
      const rm = getRm(b2);
      const registers = getRegistersForMemReg(b1);
      return MOV(b1, registers[reg], registers[rm], 2);
    }
    case Mode.MEMORY_NO_DISPLACEMENT: {
      const rm = getRm(b2);
      if (rm === RM_SPECIAL_CASE_DIRECT_ADDRESS) {
        return specialCaseDirectAddress(b1, b2, asm[p + 2], asm[p + 3]);
      }
      return withAddressCalculation2(b1, b2);
    }
    case Mode.MEMORY_8_DISPLACEMENT:
      return withAddressCalculation3(b1, b2, asm[p + 2]);
    case Mode.MEMORY_16_DISPLACEMENT:
      return withAddressCalculation4(b1, b2, asm[p + 2], asm[p + 3]);
  }
  throw new Error(`${mode} not found`);
};
