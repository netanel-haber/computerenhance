import { consumer } from "./consumer.ts";
import {
  immToMemReg,
  immToReg,
  memToAccViceVersa,
  regMemory,
} from "./mov/mod.ts";

import { getMostSignificantBits, numBits } from "./bitManipulation.ts";

const TO_REG_FROM_MEM_REG = 0b100010;
const IMMEDIATE_TO_REGISTER = 0b1011;
const MEMORY_TO_ACCUMULATOR_AND_VICE_VERSA = 0b1010000 >> 1;
const IMMEDIATE_TO_REG_MEM = 0b1100011;

const toBin = (b: number) => (b >>> 0).toString(2);

const opcodeEquals = (byte: number, expected: number) =>
  getMostSignificantBits(byte, 8 - numBits(expected)) === expected;

export const disassemble = (
  binary: Uint8Array,
): string[] => {
  const asm = ["bits 16\n"];
  let pointer = 0;
  const consume = consumer(binary, asm);
  while (pointer < binary.length) {
    const opByte = binary[pointer];
    if (opcodeEquals(opByte, TO_REG_FROM_MEM_REG)) {
      pointer = consume(regMemory, pointer);
      continue;
    }
    if (opcodeEquals(opByte, IMMEDIATE_TO_REGISTER)) {
      pointer = consume(immToReg, pointer);
      continue;
    }
    if (opcodeEquals(opByte, MEMORY_TO_ACCUMULATOR_AND_VICE_VERSA)) {
      pointer = consume(memToAccViceVersa, pointer);
      continue;
    }
    if (opcodeEquals(opByte, IMMEDIATE_TO_REG_MEM)) {
      pointer = consume(immToMemReg, pointer);
      continue;
    }
    throw new Error(
      `Could not find decoder for byte ${toBin(opByte)}`,
    );
  }
  return asm;
};
