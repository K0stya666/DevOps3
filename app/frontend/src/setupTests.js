import '@testing-library/jest-dom';

const origWarn = console.warn;

beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg, ...rest) => {
        if (typeof msg === 'string' && msg.includes('React Router Future Flag Warning')) return;
        origWarn(msg, ...rest);
    });
});

afterAll(() => {
    console.warn.mockRestore();
});
