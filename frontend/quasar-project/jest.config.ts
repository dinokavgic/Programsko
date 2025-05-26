import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'vue', 'json'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^stores/(.*)$': '<rootDir>/src/stores/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: ['/node_modules/(?!(.*)/)'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  modulePathIgnorePatterns: ['<rootDir>/functions/'],
}

export default config
