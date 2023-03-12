import { assertEquals } from "assert";
import { getBit, getBits, numBits } from "../bitManipulation.ts";
import { assertReassembledEqualsOriginalAssembly } from "./assertReassembledEqualsOriginalAssemebly.ts";

Deno.test("get bits inclusive", () => {
  assertEquals(getBits(0b11101000, { msb: 5, lsb: 3 }), 0b101);
  assertEquals(getBits(0b11101000, { lsb: 5 }), 0b111);
  assertEquals(getBits(0b11101000, { lsb: 3 }), 0b11101);
  assertEquals(getBits(0b11101000, { msb: 5 }), 0b101000);
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

Deno.test("disassembled matches original 37", () =>
  assertReassembledEqualsOriginalAssembly(
    "computer_enhance/perfaware/part1/listing_0037_single_register_mov",
  ));

Deno.test("disassembled matches original 38", () =>
  assertReassembledEqualsOriginalAssembly(
    "computer_enhance/perfaware/part1/listing_0038_many_register_mov",
  ));

Deno.test("disassembled matches original 39", () =>
  assertReassembledEqualsOriginalAssembly(
    "computer_enhance/perfaware/part1/listing_0039_more_movs",
  ));
