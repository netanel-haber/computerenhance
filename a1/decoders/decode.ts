import { Move } from "./move.ts";

export type ExtractSignedByte = ((pointer: number) => number) & {
  8: never;
};

export type ExtractSignedTwoBytes = ((pointer: number) => number) & {
  16: never;
};

export type Decoder = (
  assembly: Uint8Array,
  pointer: number,
  nom8: ExtractSignedByte,
  nom16: ExtractSignedTwoBytes,
) => Move;
