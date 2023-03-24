import { createRegMemToFromReg } from "../common/regMemToFromReg/createRegMemToFromReg.ts";
import {
  regMemRegEitherRender,
  withDFlag,
} from "../common/regMemToFromReg/types.ts";

const renderAdd = withDFlag(regMemRegEitherRender("add"));
export const addRegMemRegEither = createRegMemToFromReg(renderAdd);

const renderCmp = withDFlag(regMemRegEitherRender("cmp"));
export const cmpRegMemRegEither = createRegMemToFromReg(renderCmp);

const renderSub = withDFlag(regMemRegEitherRender("sub"));
export const subRegMemRegEither = createRegMemToFromReg(renderSub);
