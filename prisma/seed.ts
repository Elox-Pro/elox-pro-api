import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import * as fs from 'fs';
import { CreateCountryDTO } from '../src/country/dto/create-country.dto';
import { CreateUserDTO } from '../src/user/dto/create-user.dto';
import { BcryptService } from '../src/common/hashing/bcrypt-service/bcrypt.service';

const prisma = new PrismaClient();
const bcryptService = new BcryptService();

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
        const jsonData: any[] = await readJsonFile('countries.json');
        const countries = jsonData.map((country: any) => plainToInstance(CreateCountryDTO, country));
        await prisma.country.createMany({
            data: countries,
        });
        console.log('Countries seeded successfully.');
    } catch (error) {
        console.error('Error seeding countries:', error);
    }
}

/**
 * Seed users into the database.
 */
async function seedUsers() {
    try {
        const jsonData: any[] = await readJsonFile('users.json');
        const users = await Promise.all(jsonData.map(async (user: any) => {
            user.password = await bcryptService.hash(user.password);
            return plainToInstance(CreateUserDTO, user);
        }));
        await prisma.user.createMany({
            data: users,
        });
        console.log('Users seeded successfully.');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
}

/**
 * Read JSON file and parse its contents.
 *
 * @param {string} filePath - Path to the JSON file.
 * @returns {Promise<any>} - Resolves to the parsed JSON data.
 */
async function readJsonFile(filePath: string): Promise<any> {
    const fileContents = await fs.promises.readFile(`prisma/resources/data/${filePath}`, 'utf-8');
    return JSON.parse(fileContents);
}

// Execute the main seeding process
main();