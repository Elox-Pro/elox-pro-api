import { PrismaClient } from '@prisma/client';
import { BCryptStategy } from '../src/common/strategies/hashing/bcrypt.strategy';
import { FilePathService } from './service/file-path-service';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Script to seed the data base using the prisma client
 * See the script config in package.json -> prisma
 * This script requires use the dotenv-cli
 * @author Yonatan A Quintero R
 * @date 2024-04-05
 */

const filePathService = new FilePathService();
const bcryptService = new BCryptStategy();

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

/**
 * Main function to seed data into the database.
 */
async function main() {
    try {
        await seedCountries();
        await seedUsers();
        await seedAvatars();
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * Seed countries into the database.
 */
async function seedCountries() {
    try {
        const jsonData: any[] = await filePathService.readJsonFile('countries', true);
        const data = jsonData.map(country => {
            return {
                name: country.name,
                iso2: country.iso2,
                e164: country.e164
            }
        })
        await prisma.country.createMany({
            data,
        });
        console.log('✔ Countries seeded successfully.');
    } catch (error) {
        console.error('Error seeding countries:', error);
    }
}

/**
 * Seed users into the database.
 */
async function seedUsers() {
    try {
        const jsonData: any[] = await filePathService.readJsonFile('users');
        const data = await Promise.all(jsonData.map(async (user: any) => {
            const password = await bcryptService.hash(user.password);
            return {
                ...user,
                password
            };
        }));

        await prisma.user.createMany({
            data,
        });
        console.log('✔ Users seeded successfully.');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
}

/**
 * Seed avatars into the database
 */
async function seedAvatars() {
    try {
        const jsonData: any[] = await filePathService.readJsonFile("avatars", true);
        const data = await Promise.all(jsonData.map(async (avatar) => {
            return {
                url: avatar.url
            }
        }));
        await prisma.avatar.createMany({
            data
        });
        console.log("✔ Avatars seeded successfully.");
    } catch (error) {
        console.error("Error seeding avatars", error);
    }
}


// Execute the main seeding process
main();