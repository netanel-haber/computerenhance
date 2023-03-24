import { bitOn, getBit, twoByteNumber } from "../common/bitManipulation.ts";
import { encase } from "../common/common.ts";
import { MoveDecoder } from "./types.ts";
import { MOV } from "./regMemToFromReg.ts";

const renderAx = [
  (memory: number, consumed: number) => MOV("ax", encase(memory), consumed),
  (memory: number, consumed: number) => MOV(encase(memory), "ax", consumed),
];

export const memToAccViceVersa: MoveDecoder = ({ asm, p }) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];
  const w = bitOn(b1, 0);
  const render = renderAx[getBit(b1, 1)];

  if (w) {
    return render(twoByteNumber(b2, asm[p + 2]), 3);
  } else {
    return render(b2, 2);
  }
};
