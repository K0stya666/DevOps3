module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'index.js',
        'db.js',
        'routes/**/*.js',
        '!**/node_modules/**'
    ],
    coverageReporters: ['text', 'lcov', 'cobertura'],
    coverageThreshold: {
        global: { statements: 80, branches: 80, functions: 80, lines: 80 }
    }
};
