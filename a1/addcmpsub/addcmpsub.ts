// deno-fmt-ignore
export const enum Add {
  imm_acc               = 0b0000010,
  /** `d` bit */
  reg_mem_reg_either    = 0b000000,
  /** `s` bit */
  imm_reg_mem           = 0b100000,
}

// deno-fmt-ignore
export const enum Sub {
  imm_acc               = 0b0010110,
  /** `d` bit */
  reg_mem_reg_either    = 0b001010,
  /** `s` bit */
  imm_reg_mem           = 0b100000,
}

// deno-fmt-ignore
export const enum Cmp {
  imm_acc               = 0b0011110,
  /** `d` bit */
  reg_mem_reg_either    = 0b001110,
  /** `s` bit */
  imm_reg_mem           = 0b100000,
}

export const ADD = "add";
export const SUB = "sub";
export const CMP = "cmp";

export type AddSubCmp = typeof ADD | typeof SUB | typeof CMP;

export const immRegMemMiddleBits: Record<number, AddSubCmp> = {
  [0b000]: ADD,
  [0b101]: SUB,
  [0b111]: CMP,
};
