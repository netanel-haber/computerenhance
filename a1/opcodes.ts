import { Add, Cmp, Sub } from "./addcmpsub/addcmpsub.ts";
import {
  addImmToAcc,
  cmpImmWithAcc,
  subImmFromAcc,
} from "./addcmpsub/immAcc.ts";

import { immRegMem } from "./addcmpsub/immRegMem.ts";
import { Decoder } from "./decode.ts";
import { decodeJump } from "./jmp/decode.ts";
import { JumpCode } from "./jmp/jump.ts";
import {
  immToReg,
  memToAccViceVersa,
  Move,
  movImmToMemReg,
  regMemory,
} from "./mov/mod.ts";

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
  [Move.mem_to_acc]: memToAccViceVersa,
  [Move.acc_to_mem]: memToAccViceVersa,
  [Move.imm_to_reg_mem]: movImmToMemReg,
  [Add.imm_acc]: addImmToAcc,
  [Sub.imm_acc]: subImmFromAcc,
  [Cmp.imm_acc]: cmpImmWithAcc,
};

const opsWith6Bits: DecoderMap = {
  [Move.to_reg_from_mem_reg]: regMemory,
  [Cmp.imm_reg_mem]: immRegMem,
  [Add.imm_reg_mem]: immRegMem,
  [Sub.imm_reg_mem]: immRegMem,
};

const opsWith4Bits: DecoderMap = {
  [Move.imm_to_reg]: immToReg,
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
