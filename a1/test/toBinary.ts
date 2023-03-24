export const toBin = (b: number) => (b >>> 0).toString(2).padStart(8, "0");

export const arrayToBinary = (bin: Uint8Array) => [...bin].map(toBin);
