import { Decoder } from "./decoders/mod.ts";

export const consumer = (assembly: Uint8Array, asm: string[]) =>
(
  decode: Decoder,
  pointer: number,
) => {
  const [cmd, consumed] = decode(assembly, pointer);
  asm.push(cmd);
  return pointer + consumed;
};
