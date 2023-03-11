import { assertEquals } from "assert";
import { getBit, getBits } from "./utils.ts";

const W = [
  ["al", "cl", "dl", "bl", "ah", "ch", "dh", "bh"],
  ["ax", "cx", "dx", "bx", "sp", "bp", "si", "di"],
];

const decodeInstruction = (b1: number, b2: number) => {
  assertEquals(getBits(b1, { lsb: 2 }), 0b100010);
  assertEquals(getBits(b2, { lsb: 6 }), 0b11);
  const d = getBit(b1, 1), SECOND_REG_IS_SOURCE = d;
  const w = getBit(b1, 0), OPERATE_ON_16_BITS = w;

  const registers = W[Number(OPERATE_ON_16_BITS)];

  const first_reg = registers[getBits(b2, { msb: 5, lsb: 3 })];
  const second_reg = registers[getBits(b2, { msb: 2, lsb: 0 })];

  const source = SECOND_REG_IS_SOURCE ? second_reg : first_reg;
  const destination = SECOND_REG_IS_SOURCE ? first_reg : second_reg;

  return `mov ${destination}, ${source}`;
};

export const disassemble = (
  assembly: Uint8Array,
): string => {
  let asm = "bits 16\n";
  for (let i = 0; i < assembly.length; i += 2) {
    asm += "\n" + decodeInstruction(assembly[i], assembly[i + 1]);
  }
  return asm;
};
