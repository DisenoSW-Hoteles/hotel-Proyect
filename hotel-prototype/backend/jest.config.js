/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      // 151002: aviso por "hybrid module kind"; no afecta a los tests.
      { diagnostics: { ignoreCodes: [151002] } },
    ],
  },
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  clearMocks: true,

  // ─── Cobertura ────────────────────────────────────────────────────────────
  // Se mide sobre el dominio con lógica de negocio unit-testeable (seguridad/auth,
  // disponibilidad, validaciones y manejo de errores). Los controladores que
  // orquestan PostgreSQL (AdminController, ReservaController) se prueban vía
  // integración con la BD levantada (job `test` del CI), no en el suite unitario.
  collectCoverage: true,
  collectCoverageFrom: [
    'src/services/auth/**/*.ts',
    'src/services/reservas/**/*.ts',
    'src/controllers/reservas/HabitacionController.ts',
    'src/middleware/auth/**/*.ts',
    'src/middleware/error/**/*.ts',
    'src/utils/errors/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'json-summary'],

  // Umbral exigido por la rúbrica: el build falla si la cobertura baja del 70%.
  coverageThreshold: {
    global: {
      lines: 70,
      statements: 70,
      branches: 70,
      functions: 70,
    },
  },
};
