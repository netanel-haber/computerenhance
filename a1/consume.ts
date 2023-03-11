const consume = (numBytes: number) =>
(
  { asm, decode, pointer, assembly }: {
    decode: (...bytes: number[]) => string;
    pointer: number;
    asm: string[];
    assembly: Uint8Array;
  },
) => {
  const bytes: number[] = Array.from({ length: numBytes }).map((_, i) =>
    assembly[pointer + i]
  );
  asm.push(decode(...bytes));
  return pointer + numBytes;
};

export const consume2Bytes = consume(2);
