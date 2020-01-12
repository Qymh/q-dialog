module.exports = {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', 'vue-jest']
  },
  testRegex: '/tests/.*\\.spec.ts$',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules'
  },
  collectCoverageFrom: ['src/**/*.tsx?'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};
