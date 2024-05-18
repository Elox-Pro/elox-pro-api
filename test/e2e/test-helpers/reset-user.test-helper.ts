import { PrismaService } from "@app/prisma/prisma.service";
import { TfaType, User } from "@prisma/client";

export async function resetUser(prisma: PrismaService, user: User) {
    return await prisma.user.update({
        where: { username: user.username },
        data: {
            tfaType: TfaType.NONE,
            emailVerified: true,
            email: user.email,
            phone: user.phone
        }
    });
}