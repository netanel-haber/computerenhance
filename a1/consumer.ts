import { twoByteNumber } from "./bitManipulation.ts";
import {
  Decoder,
  ExtractSignedByte,
  ExtractSignedTwoBytes,
  ProduceLabel,
} from "./decode.ts";

export const consumer = (
  binary: Uint8Array,
  asm: string[],
  produceLabel: ProduceLabel,
) => {
  const nom8 = ((pointer: number) => {
    const byte = binary[pointer];
    return byte > 127 ? byte - 256 : byte;
  }) as ExtractSignedByte;
  const nom16 = ((pointer: number) => {
    const byte = twoByteNumber(binary[pointer], binary[pointer + 1]);
    return byte > 32767 ? byte - 65536 : byte;
  }) as ExtractSignedTwoBytes;
  return (
    decode: Decoder,
    pointer: number,
  ) => {
    const [cmd, consumed] = decode({
      asm: binary,
      p: pointer,
      nom8,
      nom16,
      produceLabel,
    });
    asm.push(cmd);
    return pointer + consumed;
  };
};
