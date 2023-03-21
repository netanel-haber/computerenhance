import { consumer } from "./consumer.ts";

import { Decoder, ProduceLabel } from "./decode.ts";
import { JUMP_CONSUMPTION } from "./jmp/decode.ts";
import { LabelProducer } from "./jmp/produceLabel.ts";
import { decoders4, decoders6, decoders7, decoders8 } from "./opcodes.ts";

const toBin = (b: number) => (b >>> 0).toString(2);

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
  const changePointer = (newPointer: number) => {
    consumed.push(newPointer - pointer);
    pointer = newPointer;
  };

  while (pointer < binary.length) {
    let opByte = binary[pointer];
    let decoder: Decoder | undefined;
    if (decoder = decoders8[opByte]) {
      changePointer(consume(decoder, pointer));
      continue;
    }
    opByte >>= 1;
    if (decoder = decoders7[opByte]) {
      changePointer(consume(decoder, pointer));
      continue;
    }
    opByte >>= 1;
    if (decoder = decoders6[opByte]) {
      changePointer(consume(decoder, pointer));
      continue;
    }
    opByte >>= 2;
    if (decoder = decoders4[opByte]) {
      changePointer(consume(decoder, pointer));
      continue;
    }
    throw new Error(
      `Could not find decoder for byte ${
        JSON.stringify({ bin: toBin(opByte), opByte })
      }`,
    );
  }

  const { labels } = labelProducer;
  for (
    let ins = 0, bytesCounter = 0;
    (ins < consumed.length);
    ins++, bytesCounter += consumed[ins]
  ) {
    const label = labels.get(bytesCounter);
    if (label) {
      asm[ins] = label + "\n" + asm[ins];
    }
  }

  return "bits 16\n" + asm.join("\n");
};
