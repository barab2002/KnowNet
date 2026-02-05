export default {
  displayName: 'api',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/api',
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.schema.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  maxWorkers: 1,
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
    'src/common/': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
