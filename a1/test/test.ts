// deno test --allow-read --allow-write --allow-run=nasm

import { assertEquals } from "assert";
import {
  bitOn,
  getBit,
  getBits,
  getMostSignificantBits,
  numBits,
  sext,
} from "../bitManipulation.ts";
import { cases } from "./cases.ts";
import { assertReassembledEqualsOriginalAssembly } from "./assertReassembledEqualsOriginalAssemebly.ts";

Deno.test("get bits", () => {
  assertEquals(getBits(0b11101000, 5, 3), 0b101);
  assertEquals(getBits(0b11101000, 7, 5), 0b111);
  assertEquals(getBits(0b11101000, 7, 3), 0b11101);
  assertEquals(getBits(0b11101000, 5, 0), 0b101000);
  assertEquals(getMostSignificantBits(0b11101000, 5), 0b111);
  assertEquals(getMostSignificantBits(0b11101000, 3), 0b11101);
});

Deno.test("get bit, bit on", () => {
  assertEquals(bitOn(0b10001000, 3), true);
  assertEquals(bitOn(0b10001000, 7), true);
  for (const i of [0, 1, 2, 4, 5, 6]) {
    assertEquals(bitOn(0b10001000, i), false);
  }

  assertEquals(getBit(0b10001000, 3), 1);
  assertEquals(getBit(0b10001000, 7), 1);
  for (const i of [0, 1, 2, 4, 5, 6]) {
    assertEquals(getBit(0b10001000, i), 0);
  }
});

Deno.test("num bits", () => {
  assertEquals(numBits(0b10001000), 8);
  assertEquals(numBits(0b1000), 4);
  assertEquals(numBits(0b00001), 1);
});

Deno.test("sext", () => {
  const num = 0b10000000;
  const sexted = 0b1111111110000000;
  const num2 = 0b00100000;
  assertEquals(sext(num), sexted);
  assertEquals(sext(num2), num2);
});

Object.entries(cases).forEach(([test, path]) => {
  Deno.test(test, () => assertReassembledEqualsOriginalAssembly(path));
});
