import { AddSubCmp, immRegMemMiddleBits } from "./addcmpsub.ts";

import { Decoder } from "../decode.ts";
import { getReg } from "../common.ts";

import { immToMemReg } from "../mov/immToMemReg.ts";

type RenderedImmRegMem = `${AddSubCmp} ${string}, ${string}`;

type ImmRegMemDecoder = Decoder<RenderedImmRegMem>;

export const immRegMem: ImmRegMemDecoder = (asm, p, nom8, nom16, _) => {
  const b2 = asm[p + 1];
  const operation = immRegMemMiddleBits[getReg(b2)];

  const [destination, source, consumed] = immToMemReg(asm, p, nom8, nom16, _);

  return [`${operation} ${destination}, ${source}`, consumed];
};
