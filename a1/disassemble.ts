import { consumer } from "./consumer.ts";
import {
  immToMemReg,
  immToReg,
  memToAccViceVersa,
  regMemory,
} from "./mov/mod.ts";

import { getMostSignificantBits, numBits } from "./bitManipulation.ts";
import { jumps } from "./jmp/jump.ts";
import { decodeJump, JUMP_CONSUMPTION } from "./jmp/decode.ts";
import { ProduceLabel } from "./decode.ts";
import { LabelProducer } from "./jmp/produceLabel.ts";

const TO_REG_FROM_MEM_REG = 0b100010;
const IMMEDIATE_TO_REGISTER = 0b1011;
const MEMORY_TO_ACCUMULATOR_AND_VICE_VERSA = 0b1010000 >> 1;
const IMMEDIATE_TO_REG_MEM = 0b1100011;

const toBin = (b: number) => (b >>> 0).toString(2);

const opcodeEquals = (byte: number, expected: number) =>
  getMostSignificantBits(byte, 8 - numBits(expected)) === expected;

export const disassemble = (
  binary: Uint8Array,
): string => {
  const asm: string[] = [];
  const labelProducer = new LabelProducer();
  const produceLabel: ProduceLabel = (pointer, relativeJump) =>
    labelProducer.produce(pointer + JUMP_CONSUMPTION + relativeJump);

  const consume = consumer(binary, asm, produceLabel);

  let pointer = 0;
  const consumed: number[] = [];
  const changePointer = (newPointer: number) => {
    consumed.push(newPointer - pointer);
    pointer = newPointer;
  };

  while (pointer < binary.length) {
    const opByte = binary[pointer];
    if (opcodeEquals(opByte, TO_REG_FROM_MEM_REG)) {
      changePointer(consume(regMemory, pointer));
      continue;
    }
    if (opcodeEquals(opByte, IMMEDIATE_TO_REGISTER)) {
      changePointer(consume(immToReg, pointer));
      continue;
    }
    if (opcodeEquals(opByte, MEMORY_TO_ACCUMULATOR_AND_VICE_VERSA)) {
      changePointer(consume(memToAccViceVersa, pointer));
      continue;
    }
    if (opcodeEquals(opByte, IMMEDIATE_TO_REG_MEM)) {
      changePointer(consume(immToMemReg, pointer));
      continue;
    }
    if (jumps.has(opByte)) {
      changePointer(consume(decodeJump, pointer));
      continue;
    }
    throw new Error(
      `Could not find decoder for byte ${
        JSON.stringify({ bin: toBin(opByte), opByte })
      }`,
    );
  }

  const { labels } = labelProducer;
  for (
    let ins = 0, bytesCounter = 0;
    (ins < consumed.length);
    ins++
  ) {
    const label = labels.get(bytesCounter);
    if (label) {
      asm[ins] = label + "\n" + asm[ins];
    }
    bytesCounter += consumed[ins];
  }

  return "bits 16\n" + asm.join("\n");
};
