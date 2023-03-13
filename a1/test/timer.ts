import { disassemble } from "../disassemble.ts";
import { A37, A38, A39 } from "./consts.ts";

const a37 = Deno.readFileSync(A37);
const a38 = Deno.readFileSync(A38);
const a39 = Deno.readFileSync(A39);

Deno.bench(A37, () => {
  disassemble(a37);
});
Deno.bench(A38, () => {
  disassemble(a38);
});
Deno.bench(A39, () => {
  disassemble(a39);
});
