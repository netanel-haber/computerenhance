import { assert, assertNotEquals } from "assert";
import { getBits, multiByteNumber } from "../bitManipulation.ts";
import { Decoder, getRegisters, MOV } from "./common.ts";

const getRm = (b2: number) => getBits(b2, { msb: 2, lsb: 0 });
const init = (b1: number, b2: number) => ({
  reg: getBits(b2, { msb: 5, lsb: 3 }),
  rm: getRm(b2),
  registers: getRegisters(b1),
});

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

function withAddressCalculation(
  b1: number,
  b2: number,
  ...bytes: number[]
) {
  assert(bytes.length <= 2);
  const { reg, rm, registers } = init(b1, b2);
  const rmStr = rmToRegister[rm];
  const literal = [multiByteNumber(...bytes)].filter(Boolean).map(String);
  const calculation = `[${rmStr.concat(literal).join(" + ")}]`;

  return MOV(
    b1,
    registers[reg],
    calculation,
    arguments.length,
  );
}

const RM_SPECIAL_CASE_NO_DISPLACEMENT = 0b110;

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
    case Mode.REGISTER: {
      const { reg, rm, registers } = init(b1, b2);
      return MOV(b1, registers[reg], registers[rm], 2);
    }
    case Mode.MEMORY_NO_DISPLACEMENT:
      assertNotEquals(getRm(b2), RM_SPECIAL_CASE_NO_DISPLACEMENT);
      return withAddressCalculation(b1, b2);
    case Mode.MEMORY_8_DISPLACEMENT:
      return withAddressCalculation(b1, b2, asm[p + 2]);
    case Mode.MEMORY_16_DISPLACEMENT:
      return withAddressCalculation(b1, b2, asm[p + 2], asm[p + 3]);
  }
  throw new Error(`${mode} not found`);
};
