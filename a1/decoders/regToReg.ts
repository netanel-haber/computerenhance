import { assert, assertNotEquals } from "assert";
import { getBits } from "../utils.ts";
import { computeSourceDestination, Decoder, getRegisters } from "./common.ts";

const getRegAndRm = (b2: number) => {
  const reg = getBits(b2, { msb: 5, lsb: 3 });
  const rm = getBits(b2, { msb: 2, lsb: 0 });
  return { reg, rm };
};

function registerMode(b1: number, b2: number) {
  const { reg, rm } = getRegAndRm(b2);
  const registers = getRegisters(b1);
  const { destination, source } = computeSourceDestination(
    b1,
    registers[reg],
    registers[rm],
  );
  return [`mov ${destination}, ${source}`, 2] as const;
}

const RM: Array<[string] | [string, string] | []> = [
  ["bx", "si"],
  ["bx", "di"],
  ["bp", "si"],
  ["bp", "di"],
  ["si"],
  ["di"],
  [],
  ["bx"],
];

function memoryNoDisplacement(b1: number, b2: number) {
  const registers = getRegisters(b1);
  const { reg, rm } = getRegAndRm(b2);
  assertNotEquals(rm, 6);

  const rmStr = RM[rm];
  const { destination, source } = computeSourceDestination(
    b1,
    registers[reg],
    `[${rmStr.join(" + ")}]`,
  );
  return [`mov ${destination}, ${source}`, 2] as const;
}

enum Mode {
  MEMORY_NO_DISPLACEMENT = 0b00,
  MEMORY_8_DISPLACEMENT = 0b01,
  MEMORY_16_DISPLACEMENT = 0b10,
  REGISTER = 0b11,
}
export const regMemory: Decoder = (asm, p) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];

  const mode = getBits(b2, { lsb: 6 });
  assert(mode in Mode);

  switch (mode) {
    case Mode.REGISTER:
      return registerMode(b1, b2);
    case Mode.MEMORY_NO_DISPLACEMENT:
      return memoryNoDisplacement(b1, b2);
  }
  throw new Error(`${mode} not found`);
};
