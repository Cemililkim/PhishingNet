/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.next/',
    ],
    collectCoverageFrom: [
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/index.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};

module.exports = config;
