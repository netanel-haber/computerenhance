// deno-fmt-ignore
export const enum Move {
  mem_to_acc            = 0b1010000,
  acc_to_mem            = 0b1010001,
  imm_to_reg_mem        = 0b1100011,
  to_reg_from_mem_reg   = 0b100010,
  imm_to_reg            = 0b1011,
}
