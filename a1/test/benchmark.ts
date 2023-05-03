// deno bench --allow-read ./a1/test/benchmark.ts

import { disassemble } from "../disassemble.ts";
import { cases } from "./cases.ts";

cases.forEach(([name, path]) => {
  const binary = Deno.readFileSync(path);
  Deno.bench(name, () => {
    disassemble(binary);
  });
});
