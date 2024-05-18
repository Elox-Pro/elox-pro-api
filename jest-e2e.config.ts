import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
    testEnvironment: "node",
    verbose: true,
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    // rootDir: "test",
    testRegex: ".e2e-spec.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    clearMocks: true,

    roots: ['<rootDir>'],
    modulePaths: ['./src'],
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/$1'
    },

};

export default config;