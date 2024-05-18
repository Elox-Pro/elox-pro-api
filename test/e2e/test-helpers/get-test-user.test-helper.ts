import { User } from "@prisma/client";

export function getTestUser(): User {
    return {
        username: 'alaska',
        email: "yhonax.qrz@gmail.com",
        tfaType: 'NONE',
        password: '098lkj!',
        emailVerified: true,
        role: "SYSTEM_ADMIN",
        phone: "1234567890"
    } as User;
}

export function getTestUser2(): User {
    return {
        username: 'brazil',
        email: "yhonax.qrz+1@gmail.com",
        tfaType: 'EMAIL',
        password: '098lkj!',
        emailVerified: true,
        role: "COMPANY_OWNER",
        phone: "1234567891"
    } as User;
}