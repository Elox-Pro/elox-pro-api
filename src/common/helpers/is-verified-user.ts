import { TfaType, User } from "@prisma/client";

export function isVerifiedUser(user: User): boolean {

    if (user.tfaType === TfaType.NONE) {
        return user.emailVerified || user.phoneVerified;
    }

    if (user.tfaType === TfaType.EMAIL) {
        return user.emailVerified
    }

    if (user.tfaType === TfaType.SMS) {
        return user.phoneVerified
    }

    return false;
}