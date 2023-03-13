import { bitOn } from "../bitManipulation.ts";

const wLow = ["al", "cl", "dl", "bl", "ah", "ch", "dh", "bh"] as const;
const wHigh = ["ax", "cx", "dx", "bx", "sp", "bp", "si", "di"] as const;
export const W = [wLow, wHigh] as const;

export type Decoder = (
  assembly: Uint8Array,
  pointer: number,
) => readonly [cmd: string, consumed: number];

export const MOV = (
  b1: number,
  reg: string,
  rm: string,
  consumed: number,
) => {
  const d = bitOn(b1, 1), FIRST_REG_IS_DESTINATION = d;
  const source = FIRST_REG_IS_DESTINATION ? rm : reg;
  const destination = FIRST_REG_IS_DESTINATION ? reg : rm;

  return [`mov ${destination}, ${source}`, consumed] as const;
};
