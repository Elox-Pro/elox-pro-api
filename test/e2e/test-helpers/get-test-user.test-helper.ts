import { User } from "@prisma/client";

export function getTestUser(): User {
    return {
        username: 'alaska',
        email: "yhonax.qrz@gmail.com",
        tfaType: 'NONE',
        password: '098lkj!'
    } as User;
}