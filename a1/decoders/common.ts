import { getBit, getBits } from "../bitManipulation.ts";

const wLow = ["al", "cl", "dl", "bl", "ah", "ch", "dh", "bh"] as const;
const wHigh = ["ax", "cx", "dx", "bx", "sp", "bp", "si", "di"] as const;
export const W = [wLow, wHigh] as const;

export enum Mode {
  MEMORY_NO_DISPLACEMENT = 0b00,
  MEMORY_8_DISPLACEMENT = 0b01,
  MEMORY_16_DISPLACEMENT = 0b10,
  REGISTER = 0b11,
}

export const getReg = (b2: number) => getBits(b2, 5, 3);
export const getRm = (b2: number) => getBits(b2, 2, 0);
export const getRegistersForMemReg = (b1: number) => W[getBit(b1, 0)];

export const RM_SPECIAL_CASE_DIRECT_ADDRESS = 0b110;

export const rmToRegister = [
  "bx + si",
  "bx + di",
  "bp + si",
  "bp + di",
  "si",
  "di",
  "bp",
  "bx",
];

export const encase = (content: string | number) => `[${content}]` as const;

export const joinAddress = (rmStr: string, value?: number) => {
  if (!value) return encase(rmStr);
  if (value > 0) return encase(`${rmStr} + ${String(value)}`);
  return encase(`${rmStr} - ${String(Math.abs(value))}`);
};
