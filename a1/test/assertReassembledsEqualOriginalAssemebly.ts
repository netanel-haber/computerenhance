import { assertEquals } from "assert";
import { disassemble } from "../disassemble.ts";
import { exec } from "exec";
import { basename } from "path";

export const assertReassembledEqualsOriginalAssembly = async (
  path: string,
) => {
  await exec(`nasm ${path}.asm`);
  const originalAssembly = Deno.readFileSync(path);
  const disassembled = disassemble(originalAssembly);
  const disassembledPath = `output/${basename(path)}.asm`;
  await Deno.writeTextFile(disassembledPath, disassembled);
  await exec(`nasm ${disassembledPath}`);
  assertEquals(
    originalAssembly,
    Deno.readFileSync(disassembledPath.replace(".asm", "")),
  );
};
