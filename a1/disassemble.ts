import { assertEquals } from "assert";
import { getBit, getBits } from "./utils.ts";
import { basename } from "path";

const W = [
  ["al", "cl", "dl", "bl", "ah", "ch", "dh", "bh"],
  ["ax", "cx", "dx", "bx", "sp", "bp", "si", "di"],
];

const decodeInstruction = (b1: number, b2: number) => {
  assertEquals(getBits(b1, { least: 2 }), 0b100010);
  assertEquals(getBits(b2, { least: 6 }), 0b11);
  const d = getBit(b1, 1), SECOND_REG_IS_SOURCE = d;
  const w = getBit(b1, 0), OPERATE_ON_16_BITS = w;

  const registers = W[Number(OPERATE_ON_16_BITS)];

  const first_reg = registers[getBits(b2, { most: 5, least: 3 })];
  const second_reg = registers[getBits(b2, { most: 2, least: 0 })];

  const source = SECOND_REG_IS_SOURCE ? second_reg : first_reg;
  const destination = SECOND_REG_IS_SOURCE ? first_reg : second_reg;

  return `mov ${destination}, ${source}`;
};

export const disassemble = (
  path: string,
  destination = `a1/output/${basename(path)}`,
): string => {
  const file = Deno.readFileSync(path);
  let asm = "bits 16\n";
  for (let i = 0; i < file.length; i += 2) {
    asm += "\n" + decodeInstruction(file[i], file[i + 1]);
  }
  Deno.writeTextFileSync(destination, asm);
  return destination;
};
