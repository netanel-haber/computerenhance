import { ExtractSignedByte, ExtractSignedTwoBytes } from "./decoders/common.ts";
import { Decoder } from "./decoders/mod.ts";

export const consumer = (assembly: Uint8Array, asm: string[]) => {
  const dv = new DataView(assembly.buffer);
  const nom8 = ((pointer: number) => dv.getInt8(pointer)) as ExtractSignedByte;
  const nom16 =
    ((pointer: number) => dv.getInt16(pointer, true)) as ExtractSignedTwoBytes;
  return (
    decode: Decoder,
    pointer: number,
  ) => {
    const [cmd, consumed] = decode(assembly, pointer, nom8, nom16);
    asm.push(cmd);
    return pointer + consumed;
  };
};
