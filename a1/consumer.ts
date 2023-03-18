import { twoByteNumber } from "./bitManipulation.ts";
import { ExtractSignedByte, ExtractSignedTwoBytes } from "./mov/decode.ts";

import { Decoder } from "./mov/mod.ts";

export const consumer = (assembly: Uint8Array, asm: string[]) => {
  const nom8 = ((pointer: number) => {
    const byte = assembly[pointer];
    return byte > 127 ? byte - 256 : byte;
  }) as ExtractSignedByte;
  const nom16 = ((pointer: number) => {
    const byte = twoByteNumber(assembly[pointer], assembly[pointer + 1]);
    return byte > 32767 ? byte - 65536 : byte;
  }) as ExtractSignedTwoBytes;
  return (
    decode: Decoder,
    pointer: number,
  ) => {
    const [cmd, consumed] = decode(assembly, pointer, nom8, nom16);
    asm.push(cmd);
    return pointer + consumed;
  };
};
