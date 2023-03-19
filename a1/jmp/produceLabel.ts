export class LabelProducer {
  readonly labels = new Map<number, string>();

  produce(absolute: number): string {
    const value = this.labels.get(absolute);
    if (value) {
      return value;
    }
    const label = `label${this.labels.size}`;
    this.labels.set(absolute, label);
    return label;
  }
}
