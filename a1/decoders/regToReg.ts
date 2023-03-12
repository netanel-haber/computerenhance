import { assert, assertNotEquals } from "assert";
import { getBits, twoByteNumber } from "../bitManipulation.ts";
import { computeSourceDestination, Decoder, getRegisters } from "./common.ts";

const getRm = (b2: number) => getBits(b2, { msb: 2, lsb: 0 });
const getRegAndRm = (b2: number) => ({
  reg: getBits(b2, { msb: 5, lsb: 3 }),
  rm: getRm(b2),
});

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

const rmToRegister: Array<[string] | [string, string]> = [
  ["bx", "si"],
  ["bx", "di"],
  ["bp", "si"],
  ["bp", "di"],
  ["si"],
  ["di"],
  ["bp"],
  ["bx"],
];

function memory(
  b1: number,
  b2: number,
  ...bytes: number[]
) {
  assert(bytes.length <= 2);
  const registers = getRegisters(b1);
  const { reg, rm } = getRegAndRm(b2);

  const rmStr = rmToRegister[rm];

  const calculation = rmStr.concat(
    bytes.length === 0
      ? []
      : [bytes.length === 1 ? bytes[0] : twoByteNumber(bytes[0], bytes[1])]
        .filter(Boolean).map(
          String,
        ),
  );

  const { destination, source } = computeSourceDestination(
    b1,
    registers[reg],
    `[${calculation.join(" + ")}]`,
  );
  return [`mov ${destination}, ${source}`, arguments.length] as const;
}

const RM_SPECIAL_CASE_NO_DISPLACEMENT = 0b110;

const modeNoDisplacement = (b1: number, b2: number) => {
  assertNotEquals(getRm(b2), RM_SPECIAL_CASE_NO_DISPLACEMENT);
  return memory(b1, b2);
};

const mode8BitDisplacement = (b1: number, b2: number, b3: number) =>
  memory(b1, b2, b3);

const mode16BitDisplacement = (
  b1: number,
  b2: number,
  b3: number,
  b4: number,
) => memory(b1, b2, b3, b4);

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
      return modeNoDisplacement(b1, b2);
    case Mode.MEMORY_8_DISPLACEMENT:
      return mode8BitDisplacement(b1, b2, asm[p + 2]);
    case Mode.MEMORY_16_DISPLACEMENT:
      return mode16BitDisplacement(b1, b2, asm[p + 2], asm[p + 3]);
  }
  throw new Error(`${mode} not found`);
};
