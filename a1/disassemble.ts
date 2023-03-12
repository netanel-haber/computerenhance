import { consumer } from "./consumer.ts";
import { immToReg, regMemory } from "./decoders/mod.ts";

import { getBits, numBits } from "./bitManipulation.ts";

const TO_REG_FROM_MEM_REG = 0b100010;
const IMMEDIATE_TO_REGISTER = 0b1011;

const opcodeEquals = (byte: number, expected: number) =>
  getBits(byte, { lsb: 8 - numBits(expected) }) === expected;

export const disassemble = (
  binary: Uint8Array,
): string => {
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
    throw new Error(`Could not find decoder for byte ${opByte}`);
  }
  return asm.join("\n");
};
