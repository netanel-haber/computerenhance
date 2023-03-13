import { assertEquals } from "assert";
import {
  getBit,
  getBits,
  getMostSignificantBits,
  numBits,
} from "../bitManipulation.ts";
import { A37, A38, A39 } from "./consts.ts";
import { assertReassembledEqualsOriginalAssembly } from "./assertReassembledEqualsOriginalAssemebly.ts";

Deno.test("get bits inclusive", () => {
  assertEquals(getBits(0b11101000, 5, 3), 0b101);
  assertEquals(getBits(0b11101000, 7, 5), 0b111);
  assertEquals(getBits(0b11101000, 7, 3), 0b11101);
  assertEquals(getBits(0b11101000, 5, 0), 0b101000);
  assertEquals(getMostSignificantBits(0b11101000, 5), 0b111);
  assertEquals(getMostSignificantBits(0b11101000, 3), 0b11101);
});

Deno.test("get bit", () => {
  assertEquals(getBit(0b10001000, 3), true);
  assertEquals(getBit(0b10001000, 7), true);
  for (const i of [0, 1, 2, 4, 5, 6]) {
    assertEquals(getBit(0b10001000, i), false);
  }
});

Deno.test("num bits", () => {
  assertEquals(numBits(0b10001000), 8);
  assertEquals(numBits(0b1000), 4);
  assertEquals(numBits(0b00001), 1);
});

Deno.test(A37, () => assertReassembledEqualsOriginalAssembly(A37));

Deno.test(A38, () => assertReassembledEqualsOriginalAssembly(A38));

Deno.test(A39, () => assertReassembledEqualsOriginalAssembly(A39));
