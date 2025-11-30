import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.types.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleNameMapper: {
    '^@/__mocks__/(.*)$': '<rootDir>/tests/__mocks__/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^ky$': '<rootDir>/tests/__mocks__/ky.ts',
    '^@dev-platform/types$': '<rootDir>/../types/dist/index.cjs',
  },
}

export default config
