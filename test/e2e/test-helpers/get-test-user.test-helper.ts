import { User } from "@prisma/client";

export function getTestUser(): User {
    return {
        username: 'alaska',
        tfaType: 'NONE',
        password: '098lkj!'
    } as User;
}