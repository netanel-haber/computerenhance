import { DecodedInstruction, Decoder } from "../decode.ts";
import { Jump } from "./jump.ts";

export type RenderedJump = `${Jump} ${string}`;

export type JumpDecoder = Decoder<RenderedJump>;

export type DecodedJump = DecodedInstruction<RenderedJump>;
