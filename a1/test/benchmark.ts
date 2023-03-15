// deno bench --allow-read ./a1/test/benchmark.ts

import { disassemble } from "../disassemble.ts";
import { cases } from "./consts.ts";

Object.values(cases).forEach((path) => {
  const binary = Deno.readFileSync(path);
  Deno.bench(path, () => {
    disassemble(binary);
  });
});
