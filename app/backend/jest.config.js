module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/coverage/',
        '__tests__/ci-test-runner.js'   // <- игнорируем
    ],
};