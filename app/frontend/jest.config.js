module.exports = {
    testEnvironment: 'jsdom',
    setupFiles: ['whatwg-fetch'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleFileExtensions: ['js', 'jsx', 'json'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/__tests__/**'
    ],
    coverageReporters: ['text', 'lcov', 'cobertura'],
    coverageThreshold: { global: { lines: 80, statements: 80, branches: 70, functions: 80 } },
    testMatch: ['**/__tests__/**/*.(test|spec).js', '**/?(*.)+(test).js'],
    transform: {
        '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }]
    },
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy' // чтобы не падать на import './styles.css'
    },
    testPathIgnorePatterns: ["/node_modules/", "\\.skip\\.test\\.js$"]
};
