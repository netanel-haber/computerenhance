import { assertEquals } from "assert";
import { getBit, getBits } from "./utils.ts";
import { assertReassembledEqualsOriginalAssemebly } from "./assertReassembledsEqualOriginalAssemebly.ts";

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

Deno.test("disassembled matches original", async () => {
  await Promise.all(
    [
      "computer_enhance/perfaware/part1/listing_0037_single_register_mov",
      "computer_enhance/perfaware/part1/listing_0038_many_register_mov",
    ].map(assertReassembledEqualsOriginalAssemebly),
  );
});
