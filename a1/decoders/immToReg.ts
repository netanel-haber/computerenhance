import { getBit, getBits, twoByteNumber } from "../bitManipulation.ts";
import { Decoder, W } from "./common.ts";

export const immToReg: Decoder = (asm, p) => {
  const b1 = asm[p];
  const w = getBit(b1, 3), OPERATE_ON_WORD = w;
  const registers = W[Number(OPERATE_ON_WORD)];
  const first_reg = registers[getBits(b1, { msb: 2, lsb: 0 })];

  const lsb = asm[p + 1];
  if (w) {
    const msb = asm[p + 2];
    return [`mov ${first_reg}, ${twoByteNumber(lsb, msb)}`, 3];
  } else {
    return [`mov ${first_reg}, ${lsb}`, 2];
  }
};
