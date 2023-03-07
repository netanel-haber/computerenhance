import { assertEquals } from "assert";
import { getBit, getBits, trimListing } from "./utils.ts";
import { disassemble } from "./disassemble.ts";

Deno.test("get bits inclusive", () => {
  assertEquals(getBits(0b11101000, { most: 5, least: 3 }), 0b101);
  assertEquals(getBits(0b11101000, { least: 5 }), 0b111);
  assertEquals(getBits(0b11101000, { least: 3 }), 0b11101);
  assertEquals(getBits(0b11101000, { most: 5 }), 0b101000);
});

Deno.test("get bit", () => {
  assertEquals(getBit(0b10001000, 3), true);
  assertEquals(getBit(0b10001000, 7), true);
  for (const i of [0, 1, 2, 4, 5, 6]) {
    assertEquals(getBit(0b10001000, i), false);
  }
});

Deno.test("disassembled matches original", () => {
  assertEquals(
    Deno.readTextFileSync(
      disassemble(
        "computer_enhance/perfaware/part1/listing_0037_single_register_mov",
      ),
    ),
    trimListing(Deno.readTextFileSync(
      "computer_enhance/perfaware/part1/listing_0037_single_register_mov.asm",
    )),
  );
  assertEquals(
    Deno.readTextFileSync(
      disassemble(
        "computer_enhance/perfaware/part1/listing_0038_many_register_mov",
      ),
    ),
    trimListing(Deno.readTextFileSync(
      "computer_enhance/perfaware/part1/listing_0038_many_register_mov.asm",
    )),
  );
});
