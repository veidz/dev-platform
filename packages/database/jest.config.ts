import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/__mocks__/(.*)$': '<rootDir>/tests/__mocks__/$1',
    '^@/tests/repositories/__mocks__$':
      '<rootDir>/tests/unit/repositories/__mocks__/index',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/client.ts',
    '!src/**/*.types.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
}

export default config
