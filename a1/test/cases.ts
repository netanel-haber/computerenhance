const prefix = "computer_enhance/perfaware/part1/listing_00";
const assignment = <S extends string>(listing: S) =>
  [listing, `${prefix}${listing}`] as const;

export const cases = [
  "37_single_register_mov",
  "38_many_register_mov",
  "39_more_movs",
  "40_challenge_movs",
  "41_add_sub_cmp_jnz",
].map(assignment);
