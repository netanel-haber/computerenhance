/**
 * Nominal typing hack.
 */
export type ExtractSignedByte = ((pointer: number) => number) & {
  8: never;
};

/**
 * Nominal typing hack.
 */
export type ExtractSignedTwoBytes = ((pointer: number) => number) & {
  16: never;
};

export type DecodedInstruction<S extends string> = readonly [
  cmd: S,
  consumed: number,
];

export type ProduceLabel = (pointer: number, jumpTo: number) => string;

export type DecoderArgs = {
  asm: Uint8Array;
  p: number;
  nom8: ExtractSignedByte;
  nom16: ExtractSignedTwoBytes;
  produceLabel: ProduceLabel;
};

export type Decoder<S extends string = string> = (
  args: DecoderArgs,
) => DecodedInstruction<S>;
