import { createRegMemToFromReg } from "../common/regMemToFromReg/createRegMemToFromReg.ts";
import {
  regMemRegEitherRender,
  withDFlag,
} from "../common/regMemToFromReg/types.ts";

export const MOV = regMemRegEitherRender("mov");
export const movWithDFlag = withDFlag(MOV);

export const regMemory = createRegMemToFromReg(movWithDFlag);
