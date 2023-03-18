import { getBit, getBits, twoByteNumber } from "../bitManipulation.ts";
import { W } from "../common.ts";
import { MoveDecoder } from "./types.ts";
import { MOV } from "./render.ts";

export const immToReg: MoveDecoder = (asm, p) => {
  const b1 = asm[p];
  const WORD = getBit(b1, 3);
  const registers = W[WORD];
  const first_reg = registers[getBits(b1, 2, 0)];

  const lsb = asm[p + 1];
  if (WORD) {
    const msb = asm[p + 2];
    return MOV(first_reg, twoByteNumber(lsb, msb), 3);
  } else {
    return MOV(first_reg, lsb, 2);
  }
};
