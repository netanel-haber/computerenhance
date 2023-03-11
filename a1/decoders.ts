import { assertEquals } from "assert";
import { getBit, getBits } from "./utils.ts";

const W = [
  ["al", "cl", "dl", "bl", "ah", "ch", "dh", "bh"],
  ["ax", "cx", "dx", "bx", "sp", "bp", "si", "di"],
];

const assertMOD = (byte: number, expected: number) => {
  assertEquals(getBits(byte, { lsb: 6 }), expected);
};

export const decodeRegToReg = (b1: number, b2: number) => {
  assertMOD(b2, 0b11);
  const d = getBit(b1, 1), SECOND_REG_IS_SOURCE = d;
  const w = getBit(b1, 0), OPERATE_ON_16_BITS = w;

  const registers = W[Number(OPERATE_ON_16_BITS)];

  const first_reg = registers[getBits(b2, { msb: 5, lsb: 3 })];
  const second_reg = registers[getBits(b2, { msb: 2, lsb: 0 })];

  const source = SECOND_REG_IS_SOURCE ? second_reg : first_reg;
  const destination = SECOND_REG_IS_SOURCE ? first_reg : second_reg;

  return `mov ${destination}, ${source}`;
};
