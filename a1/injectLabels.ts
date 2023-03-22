import { LabelProducer } from "./jmp/produceLabel.ts";

export const injectLabels = (
  asm: string[],
  bytesConsumedPerInstruction: number[],
  labelProducer: LabelProducer,
) => {
  const { labels } = labelProducer;
  for (
    let i = 0, bytesCounter = 0;
    (i < bytesConsumedPerInstruction.length);
    i++, bytesCounter += bytesConsumedPerInstruction[i]
  ) {
    const label = labels[bytesCounter];
    if (label) {
      asm[i] = label + "\n" + asm[i];
    }
  }
};
