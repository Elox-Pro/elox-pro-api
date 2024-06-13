import { User } from "@prisma/client";

export type UserType = {
    roleText: string
    genderText: string
    tfaTypeText: string
} & User;