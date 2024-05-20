import { escapeForUrl } from '../src/common/helpers/escape-for-url.helper';
import { BCryptStategy } from '../src/common/strategies/hashing/bcrypt.strategy';
import { faker } from '@faker-js/faker';
import { PrismaClient, Role } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});
const bcryptService = new BCryptStategy();
const PASSWORD = "123";

async function createCompanies() {

    console.log("Creating Companies...");
    for (let i = 0; i < 100; i++) {
        await createCompany();
    }

}

async function createCompany() {
    const name = faker.company.name();
    const imageName = escapeForUrl(name);
    const imageUrl = "https://api.dicebear.com/8.x/identicon/svg?seed=" + imageName;
    const user = await getUser();

    if (!await existsCompanyOrUser(name, user.username)) {

        await prisma.company.create({
            data: {
                name,
                imageUrl,
                users: {
                    create: [{
                        ...user,
                    }]
                },
            },
        });
    }
}

async function getUser() {
    const username = faker.internet.userName();
    return {
        username,
        email: faker.internet.email(),
        password: await bcryptService.hash((PASSWORD)),
        role: Role.COMPANY_OWNER,
        emailVerified: true,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=" + username
    }
}

async function existsCompanyOrUser(companyName: string, username: string): Promise<boolean> {
    const company = await prisma.company.findUnique({
        where: {
            name: companyName
        }
    });
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    });
    return !!company || !!user;
}

createCompanies().then(() => {
    console.log('✔ Companis created successfully.');
}).catch(error => {
    console.error('Error creating companies', error);
    console.error(error);
});