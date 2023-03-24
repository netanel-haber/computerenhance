import { AddSubCmp, immRegMemMiddleBits } from "./addcmpsub.ts";

import { Decoder } from "../decode.ts";
import { getReg } from "../common/common.ts";
import { immToMemReg } from "../common/immToMemReg.ts";

type RenderedImmRegMem = `${AddSubCmp} ${string}, ${string}`;

type ImmRegMemDecoder = Decoder<RenderedImmRegMem>;

export const immRegMem: ImmRegMemDecoder = (args) => {
  const b2 = args.asm[args.p + 1];
  const operation = immRegMemMiddleBits[getReg(b2)];

  const [destination, source, consumed] = immToMemReg(args, true);

  return [`${operation} ${destination}, ${source}`, consumed];
};
