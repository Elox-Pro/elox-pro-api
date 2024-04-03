import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import * as fs from 'fs';
import { CreateCountryDTO } from '../src/country/dtos/create-country.dto';
import { CreateUserDTO } from '../src/user/dtos/create-user/create-user.dto';
import { BCryptStategy } from '../src/common/strategies/hashing/bcrypt.strategy';
import * as dotenv from 'dotenv';
dotenv.config();

enum Env {
    DEV = 'development',
    TEST = 'testing',
    PROD = 'production'
}

const env = (process.env.ENVIRONMENT as Env) || Env.DEV;

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

const bcryptService = new BCryptStategy();

/**
 * Main function to seed data into the database.
 */
async function main() {
    try {
        await seedCountries();
        await seedUsers();
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
        const jsonData: any[] = await readJsonFile('countries');
        const countries = jsonData.map((country: any) => plainToInstance(CreateCountryDTO, country));
        await prisma.country.createMany({
            data: countries,
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
        const jsonData: any[] = await readJsonFile('users');
        const users = await Promise.all(jsonData.map(async (user: any) => {
            user.password = await bcryptService.hash(user.password);
            return plainToInstance(CreateUserDTO, user);
        }));

        await prisma.user.createMany({
            data: users,
        });
        console.log('✔ Users seeded successfully.');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
}

/**
 * Read JSON file and parse its contents.
 *
 * @param {string} fileName - Name to the JSON file.
 * @returns {Promise<any>} - Resolves to the parsed JSON data.
 */
async function readJsonFile(fileName: string): Promise<any> {

    let filePath: string = null;
    if (env === Env.TEST) {
        filePath = `prisma/resources/data/test/${fileName}.test.json`;
    } else {
        filePath = `prisma/resources/data/${fileName}.json`;
    }

    return JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
}

// Execute the main seeding process
main();