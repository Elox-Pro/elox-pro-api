import * as fs from 'fs';
import { Enviroment } from '../../src/common/enums/enviroment.enum';

export enum FilePathEnviroment {
    DEVELOPMENT = Enviroment.DEVELOPMENT,
    TEST = Enviroment.TEST,
    PRODUCTION = Enviroment.PRODUCTION,
    COMMON = "common"
}

/**
 * Utility class for managing file paths and reading JSON data.
 *
 * @author Yonatan A Quintero R
 * @date 2024-04-05
 */
export class FilePathService {
    private readonly path: string;
    private readonly environment: FilePathEnviroment;
    private readonly resources: Map<FilePathEnviroment, string>;

    /**
     * Creates a new FilePathService instance.
     * - Initializes the class properties based on environment and resource paths.
     */
    constructor() {
        this.path = "prisma/resources/data";
        this.environment = (process.env.ENVIRONMENT as FilePathEnviroment) || FilePathEnviroment.DEVELOPMENT;
        this.resources = new Map();
        Object.values(FilePathEnviroment).forEach((env) => {
            this.resources.set(env, `${this.path}/${env}/`);
        });
    }

    /**
     * Builds a file path based on environment and filename.
     *
     * @param {string} fileName - Name of the file.
     * @param {boolean} isCommon - Whether to target common resources (optional, defaults to false).
     * @returns {string} The constructed file path.
     * @throws {Error} If the requested resource environment is not found.
     */
    public buildFilePath(fileName: string, isCommon: boolean = false): string {
        const env = isCommon ? FilePathEnviroment.COMMON : this.environment;
        const resource = this.resources.get(env);

        if (!resource) {
            throw new Error("Resource not found");
        }

        return resource + fileName + ".json";
    }

    /**
     * Reads a JSON file and parses its contents.
     *
     * @param {string} fileName - Name of the JSON file.
     * @param {boolean} isCommon - Whether to target common resources (optional, defaults to false).
     * @returns {Promise<any>} Resolves to the parsed JSON data as a string (corrected type).
     */
    public async readJsonFile(fileName: string, isCommon: boolean = false): Promise<any> {
        return JSON.parse(await fs.promises.readFile(this.buildFilePath(fileName, isCommon), 'utf-8'));
    }
}
