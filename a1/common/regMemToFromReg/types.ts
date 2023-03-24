import { AddSubCmp } from "../../addcmpsub/addcmpsub.ts";
import { DecodedInstruction } from "../../decode.ts";
import { bitOn } from "../bitManipulation.ts";

export type Command = "mov" | AddSubCmp;

export type Instruction<C extends Command> = `${C} ${string}, ${string}`;

type InstructionWithDFlag<C extends Command> = DecodedInstruction<
  Instruction<C>
>;

type Render<C extends Command> = (
  destination: string,
  source: string | number,
  consumed: number,
) => InstructionWithDFlag<C>;

export type RenderWithDFlag<C extends Command> = (
  b1: number,
  reg: string,
  rm: string,
  consumed: number,
) => InstructionWithDFlag<C>;

export const regMemRegEitherRender =
  <C extends Command>(command: C): Render<C> =>
  (destination, source, consumed) => [
    `${command} ${destination}, ${source}`,
    consumed,
  ];

export const withDFlag =
  <C extends Command>(renderFunc: Render<C>): RenderWithDFlag<C> =>
  (b1, reg, rm, consumed) => {
    const d = bitOn(b1, 1), FIRST_REG_IS_DESTINATION = d;
    const source = FIRST_REG_IS_DESTINATION ? rm : reg;
    const destination = FIRST_REG_IS_DESTINATION ? reg : rm;
    return renderFunc(destination, source, consumed);
  };
