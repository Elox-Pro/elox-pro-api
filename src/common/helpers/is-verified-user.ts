import { TfaType, User } from "@prisma/client";

export function isVerifiedUser(user: User): boolean {

    if (user.tfaType === TfaType.EMAIL && user.emailVerified) {
        return true;
    }

    if (user.tfaType === TfaType.SMS && user.phoneVerified) {
        return true;
    }

    return false;
}