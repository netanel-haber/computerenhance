import { getBit, getBits } from "../utils.ts";
import { Decoder, W } from "./common.ts";

const enum Mode {
  MEMORY_NO_DISPLACEMENT = 0b00,
  MEMORY_8_DISPLACEMENT = 0b01,
  MEMORY_16_DISPLACEMENT = 0b10,
  REGISTER = 0b11,
}

const getMode = (byte: number): Mode => getBits(byte, { lsb: 6 });

function registerMode(b1: number, b2: number) {
  const d = getBit(b1, 1), FIRST_REG_IS_DESTINATION = d;
  const w = getBit(b1, 0), OPERATE_ON_WORD = w;

  const registers = W[Number(OPERATE_ON_WORD)];

  const first_reg = registers[getBits(b2, { msb: 5, lsb: 3 })];
  const second_reg = registers[getBits(b2, { msb: 2, lsb: 0 })];

  const source = FIRST_REG_IS_DESTINATION ? second_reg : first_reg;
  const destination = FIRST_REG_IS_DESTINATION ? first_reg : second_reg;

  return [`mov ${destination}, ${source}`, 2] as const;
}

function memoryNoDisplacement(b1: number, b2: number) {
  const d = getBit(b1, 1), FIRST_REG_IS_DESTINATION = d;
  const w = getBit(b1, 0), OPERATE_ON_WORD = w;

  const registers = W[Number(OPERATE_ON_WORD)];

  const first_reg = registers[getBits(b2, { msb: 5, lsb: 3 })];
  const second_reg = registers[getBits(b2, { msb: 2, lsb: 0 })];

  const source = FIRST_REG_IS_DESTINATION ? second_reg : first_reg;
  const destination = FIRST_REG_IS_DESTINATION ? first_reg : second_reg;

  return [`mov ${destination}, ${source}`, 2] as const;
}

export const regMemory: Decoder = (asm, p) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];

  const mode = getMode(b2);

  switch (mode) {
    case Mode.REGISTER:
      return registerMode(b1, b2);
    case Mode.MEMORY_NO_DISPLACEMENT:
      return memoryNoDisplacement(b1, b2);
  }
  throw new Error("hey");
};
