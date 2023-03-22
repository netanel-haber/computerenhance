import { bitOn, twoByteNumber } from "../bitManipulation.ts";
import { AddSubCmp } from "./addcmpsub.ts";

import { Decoder } from "../decode.ts";

type RenderedImmAcc = `${AddSubCmp} ${"ax" | "al"}, ${number}`;

type ImmAccDecoder = Decoder<RenderedImmAcc>;

const immAcc = (cmd: AddSubCmp): ImmAccDecoder => (asm, p) => {
  const b1 = asm[p];
  const b2 = asm[p + 1];
  const w = bitOn(b1, 0);

  if (w) {
    return [`${cmd} ax, ${twoByteNumber(b2, asm[p + 2])}`, 3];
  } else {
    return [`${cmd} al, ${b2}`, 2];
  }
};

export const addImmToAcc = immAcc("add");
export const subImmFromAcc = immAcc("sub");
export const cmpImmWithAcc = immAcc("cmp");
