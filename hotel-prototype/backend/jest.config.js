/** @type {import('jest').Config} */
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    testMatch: ["**/*.spec.ts"],
    collectCoverageFrom: [
        "src/middleware/auth/**/*.ts",
        "src/services/reservas/**/*.ts",
        "src/models/dtos/**/*.ts",
        "src/utils/errors/**/*.ts",
    ],
    coverageDirectory: "./coverage",
    coverageReporters: ["cobertura", "text", "lcov"],
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                tsconfig: {
                    module: "CommonJS",
                    isolatedModules: true,
                    esModuleInterop: true,
                },
                diagnostics: false,
            },
        ],
    },
    coverageThreshold: {
        global: {
            branches: 70,
            lines: 70,
        },
    },
}

module.exports = config
