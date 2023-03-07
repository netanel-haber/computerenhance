import { assert } from "assert";

const ONE = 0b1;

export const getBits = (
  byte: number,
  { most = 7, least = 0 }: { most?: number; least?: number } = {},
): number => {
  const length = most - least;
  assert(length >= 0);
  const mask = ((ONE << (length + 1)) - 1) << least;
  const masked = (byte & mask) >> least;
  return masked;
};

export const getBit = (byte: number, index: number) =>
  Boolean(getBits(byte, { most: index, least: index }));

export const trimListing = (listing: string): string =>
  listing.replaceAll(/;.*\n/g, "").trim();
