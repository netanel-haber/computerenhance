import { Decoder } from "./decode.ts";
import { decodeJump } from "./jmp/decode.ts";
import { JumpCode } from "./jmp/jump.ts";
import {
  immToMemReg,
  immToReg,
  memToAccViceVersa,
  regMemory,
} from "./mov/mod.ts";

const mem_to_acc = 0b1010000;
const acc_to_mem = 0b1010001;
const imm_to_reg_mem = 0b1100011;
const to_reg_from_mem_reg = 0b100010;
const imm_to_reg = 0b1011;

type DecoderMap = Record<number, Decoder | undefined>;

const opsWith8Bits: DecoderMap = {
  [JumpCode.je]: decodeJump,
  [JumpCode.jl]: decodeJump,
  [JumpCode.jle]: decodeJump,
  [JumpCode.jb]: decodeJump,
  [JumpCode.jbe]: decodeJump,
  [JumpCode.jp]: decodeJump,
  [JumpCode.jo]: decodeJump,
  [JumpCode.js]: decodeJump,
  [JumpCode.jne]: decodeJump,
  [JumpCode.jnz]: decodeJump,
  [JumpCode.jnl]: decodeJump,
  [JumpCode.jg]: decodeJump,
  [JumpCode.jnb]: decodeJump,
  [JumpCode.ja]: decodeJump,
  [JumpCode.jnp]: decodeJump,
  [JumpCode.ja]: decodeJump,
  [JumpCode.jnp]: decodeJump,
  [JumpCode.jno]: decodeJump,
  [JumpCode.jns]: decodeJump,
  [JumpCode.loop]: decodeJump,
  [JumpCode.loopz]: decodeJump,
  [JumpCode.loopnz]: decodeJump,
  [JumpCode.jcxz]: decodeJump,
};

const opsWith7Bits: DecoderMap = {
  [mem_to_acc]: memToAccViceVersa,
  [acc_to_mem]: memToAccViceVersa,
  [imm_to_reg_mem]: immToMemReg,
};

const opsWith6Bits: DecoderMap = {
  [to_reg_from_mem_reg]: regMemory,
};

const opsWith4Bits: DecoderMap = {
  [imm_to_reg]: immToReg,
};

/**
 * If a decoder isn't found in each map, `opByte >>= 1|2` to arrive at next map.
 */
export const decodePath = [
  [opsWith8Bits, 1],
  [opsWith7Bits, 1],
  [opsWith6Bits, 2],
  [opsWith4Bits, 0],
] as const;
