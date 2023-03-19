import { opcodeToJump } from "./jump.ts";
import { JumpDecoder } from "./types.ts";

export const JUMP_CONSUMPTION = 2;

export const decodeJump: JumpDecoder = (asm, p, nom8, _, produceLabel) => {
  const jumpTo = nom8(p + 1);
  const label = produceLabel(p, jumpTo);
  return [`${opcodeToJump(asm[p])} ${label}`, JUMP_CONSUMPTION];
};
