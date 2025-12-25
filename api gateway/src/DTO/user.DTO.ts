import type { ROLE } from "../generated/prisma/enums.js"

export type signUpDTO={
    name:string,
    email:string,
    password:string
}

export type signInDTO={
    email:string,
    password:string
}

export type InputDataDTO={
    id:number,
    email:string,
}

export type userDataDTO={
    id:number,
    role:ROLE
}