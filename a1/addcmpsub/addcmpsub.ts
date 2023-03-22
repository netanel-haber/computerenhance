// deno-fmt-ignore
export const enum Add {
  imm_to_acc                    = 0b0000010,
  reg_mem_with_reg_to_either    = 0b000000,
  imm_to_reg_mem                = 0b100000,
}

// deno-fmt-ignore
export const enum Sub {
  imm_from_acc                  = 0b0010110,
  reg_mem_and_reg_to_either     = 0b001010,
  imm_to_reg_mem                = 0b100000,
}

// deno-fmt-ignore
export const enum Cmp {
  imm_with_acc                  = 0b0011110,
  imm_with_reg_mem              = 0b100000,
  reg_mem_and_reg               = 0b001110,
}

export const ADD = "add";
export const SUB = "sub";
export const CMP = "cmp";

export type AddSubCmp = typeof ADD | typeof SUB | typeof CMP;
