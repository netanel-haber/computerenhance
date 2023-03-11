import { assertEquals } from "assert";
import { disassemble } from "./disassemble.ts";
import { exec } from "exec";
import { basename } from "path";

export const assertReassembledEqualsOriginalAssemebly = async (
  path: string,
) => {
  const originalAssembly = Deno.readFileSync(path);
  const disassembled = disassemble(await originalAssembly);
  const disassembledPath = `output/${basename(path)}.asm`;
  await Deno.writeTextFile(disassembledPath, disassembled);
  await exec(`nasm ${disassembledPath}`);
  assertEquals(
    originalAssembly,
    Deno.readFileSync(disassembledPath.replace(".asm", "")),
  );
};
