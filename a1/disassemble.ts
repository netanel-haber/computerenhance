import { consumer } from "./consumer.ts";

import { ProduceLabel } from "./decode.ts";
import { injectLabels } from "./injectLabels.ts";
import { JUMP_CONSUMPTION } from "./jmp/decode.ts";
import { LabelProducer } from "./jmp/LabelProducer.ts";
import { decodePath } from "./opcodes.ts";
import { arrayToBinary } from "./test/toBinary.ts";

export const disassemble = (
  binary: Uint8Array,
): string => {
  const asm: string[] = [];
  const labelProducer = new LabelProducer();
  const produceLabel: ProduceLabel = (pointer, relativeJump) =>
    labelProducer.produce(pointer + JUMP_CONSUMPTION + relativeJump);

  const consume = consumer(binary, asm, produceLabel);

  let pointer = 0;
  const consumed: number[] = [];

  outer_loop:
  while (pointer < binary.length) {
    let opByte = binary[pointer];

    for (const [map, shiftRight] of decodePath) {
      const decoder = map[opByte];
      if (decoder) {
        const newPointer = consume(decoder, pointer);
        consumed.push(newPointer - pointer);
        pointer = newPointer;
        continue outer_loop;
      }
      opByte >>= shiftRight;
    }
    const bytes = arrayToBinary(binary)
      .map((b, i) => i === pointer ? `${b} <<<<` : b).join("\n");
    console.error({ consumed, asm });
    throw new Error(
      `Could not find decoder for byte. pointer: ${pointer}.\n${bytes}`,
    );
  }

  injectLabels(asm, consumed, labelProducer);

  return "bits 16\n" + asm.join("\n");
};
