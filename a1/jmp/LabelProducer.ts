export class LabelProducer {
  readonly labels: Record<number, string> = {};
  labelCounter = 0;

  produce(absolute: number): string {
    const value = this.labels[absolute];
    if (value) {
      return value;
    }
    const label = `label${this.labelCounter++}`;
    this.labels[absolute] = label;
    return label;
  }
}
