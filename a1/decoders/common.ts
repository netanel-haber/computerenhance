export const W = [
  ["al", "cl", "dl", "bl", "ah", "ch", "dh", "bh"],
  ["ax", "cx", "dx", "bx", "sp", "bp", "si", "di"],
];

export type Decoder = (
  assembly: Uint8Array,
  pointer: number,
) => readonly [cmd: string, consumed: number];
