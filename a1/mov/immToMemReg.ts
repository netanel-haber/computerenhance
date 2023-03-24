import { immToMemReg } from "../common/immToMemReg.ts";
import { MOV } from "./render.ts";
import { MoveDecoder } from "./types.ts";

export const movImmToMemReg: MoveDecoder = (args) =>
  MOV(...immToMemReg(args, false));
