import { DecodedInstruction, Decoder } from "../decode.ts";

export type Move = `mov ${string}, ${string | number}`;

export type DecodedMove = DecodedInstruction<Move>;

export type MoveDecoder = Decoder<Move>;
