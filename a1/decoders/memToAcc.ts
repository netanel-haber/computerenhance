import { bitOn, getBit, twoByteNumber } from "../bitManipulation.ts";
import { Decoder } from "./common.ts";

const renderAx = [
  (num: number) => `MOV ax, [${num}]`,
  (num: number) => `MOV [${num}], ax`,
];

export const memToAccViceVersa: Decoder = (asm, p) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];
  const w = bitOn(b1, 0);
  const render = renderAx[getBit(b1, 1)];

  if (w) {
    const num = twoByteNumber(b2, asm[p + 2]);
    return [render(num), 3];
  } else {
    return [render(b2), 2];
  }
};
