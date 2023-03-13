export const getBits = (
  byte: number,
  msb: number,
  lsb: number,
): number => {
  const length = msb - lsb;
  const mask = ((1 << (length + 1)) - 1) << lsb;
  const masked = (byte & mask) >> lsb;
  return masked;
};

export const getMostSignificantBits = (
  byte: number,
  leastIncludedBit: number,
): number => getBits(byte, 7, leastIncludedBit);

export const getBit = (byte: number, index: number) =>
  getBits(byte, index, index) !== 0;

export const numBits = (byte: number): number =>
  Math.floor(Math.log2(byte) + 1);

export const twoByteNumber = (lsb: number, msb: number) => lsb + (msb << 8);
