import { assert } from "assert";

const ONE = 0b1;

export const getBits = (
  byte: number,
  { msb = 7, lsb = 0 }: { msb?: number; lsb?: number } = {},
): number => {
  const length = msb - lsb;
  assert(length >= 0);
  const mask = ((ONE << (length + 1)) - 1) << lsb;
  const masked = (byte & mask) >> lsb;
  return masked;
};

export const getBit = (byte: number, index: number) =>
  Boolean(getBits(byte, { msb: index, lsb: index }));

export const numBits = (byte: number): number =>
  Math.floor(Math.log2(byte) + 1);

export const multiByteNumber = (...bytes: number[]) =>
  bytes.reduce((acc, cur, i) => acc + (cur << 8 * i), 0);

export const twoByteNumber = (lsb: number, msb: number) =>
  multiByteNumber(lsb, msb);
