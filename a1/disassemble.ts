import { consumer } from "./consumer.ts";
import { immToReg, regToReg } from "./decoders.ts";

import { getBits, numBits } from "./utils.ts";

const TO_REG_FROM_MEM_REG = 0b100010;
const IMMEDIATE_TO_REGISTER = 0b1011;

const opcodeEquals = (byte: number, expected: number) =>
  getBits(byte, { lsb: 8 - numBits(expected) }) === expected;

export const disassemble = (
  assembly: Uint8Array,
): string => {
  const asm = ["bits 16\n"];
  let pointer = 0;
  const consume = consumer(assembly, asm);
  while (pointer < assembly.length) {
    const opByte = assembly[pointer];
    if (opcodeEquals(opByte, TO_REG_FROM_MEM_REG)) {
      pointer = consume(regToReg, pointer);
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
