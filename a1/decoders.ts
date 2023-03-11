import { assertEquals } from "assert";
import { getBit, getBits } from "./utils.ts";

const W = [
  ["al", "cl", "dl", "bl", "ah", "ch", "dh", "bh"],
  ["ax", "cx", "dx", "bx", "sp", "bp", "si", "di"],
];

const assertMOD = (byte: number, expected: number) => {
  assertEquals(getBits(byte, { lsb: 6 }), expected);
};

export type Decoder = (
  assembly: Uint8Array,
  pointer: number,
) => readonly [cmd: string, consumed: number];

export const regToReg: Decoder = (asm, p) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];
  assertMOD(b2, 0b11);
  const d = getBit(b1, 1), FIRST_REG_IS_DESTINATION = d;
  const w = getBit(b1, 0), OPERATE_ON_WORD = w;

  const registers = W[Number(OPERATE_ON_WORD)];

  const first_reg = registers[getBits(b2, { msb: 5, lsb: 3 })];
  const second_reg = registers[getBits(b2, { msb: 2, lsb: 0 })];

  const source = FIRST_REG_IS_DESTINATION ? second_reg : first_reg;
  const destination = FIRST_REG_IS_DESTINATION ? first_reg : second_reg;

  return [`mov ${destination}, ${source}`, 2] as const;
};

export const immToReg: Decoder = (asm, p) => {
  const b1 = asm[p];
  const w = getBit(b1, 3), OPERATE_ON_WORD = w;
  const registers = W[Number(OPERATE_ON_WORD)];
  const first_reg = registers[getBits(b1, { msb: 2, lsb: 0 })];

  const lsb = asm[p + 1];
  if (w) {
    const msb = asm[p + 2];
    return [`mov ${first_reg}, ${lsb + (msb << 8)}`, 3];
  } else {
    return [`mov ${first_reg}, ${lsb}`, 2];
  }
};
