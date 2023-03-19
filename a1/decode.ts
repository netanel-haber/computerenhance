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

export type Decoder<S extends string = string> = (
  assembly: Uint8Array,
  pointer: number,
  nom8: ExtractSignedByte,
  nom16: ExtractSignedTwoBytes,
  produceLabel: ProduceLabel,
) => DecodedInstruction<S>;
