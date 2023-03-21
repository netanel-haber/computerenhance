// deno-fmt-ignore
export enum JumpCode {
    je =        0b01110100,
    jl =        0b01111100,
    jle =       0b01111110,
    jb =        0b01110010,
    jbe =       0b01110110,
    jp =        0b01111010,
    jo =        0b01110000,
    js =        0b01111000,
    jne =       0b01110101,
    jnz =       jne,
    jnl =       0b01111101,
    jg =        0b01111111,
    jnb =       0b01110011,
    ja =        0b01110111,
    jnp =       0b01111011,
    jno =       0b01110001,
    jns =       0b01111001,
    loop =      0b11100010,
    loopz =     0b11100001,
    loopnz =    0b11100000,
    jcxz =      0b11100011,
}

export type Jump = keyof typeof JumpCode;

export const opcodeToJump = (op: number) => JumpCode[op] as Jump;
