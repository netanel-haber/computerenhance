import { bitOn } from "../bitManipulation.ts";
import { DecodedMove } from "./types.ts";

export const MOV = (
  destination: string,
  source: string | number,
  consumed: number,
): DecodedMove => [`mov ${destination}, ${source}`, consumed] as const;

export const movWithDFlag = (
  b1: number,
  reg: string,
  rm: string,
  consumed: number,
): DecodedMove => {
  const d = bitOn(b1, 1), FIRST_REG_IS_DESTINATION = d;
  const source = FIRST_REG_IS_DESTINATION ? rm : reg;
  const destination = FIRST_REG_IS_DESTINATION ? reg : rm;
  return MOV(destination, source, consumed);
};
