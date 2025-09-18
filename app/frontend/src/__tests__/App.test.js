import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

let warnSpy; // хранить ссылку на шпиона

beforeAll(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
    warnSpy.mockRestore(); // восстанавливаем именно шпиона
});

test('рендерится каркас приложения', () => {
    render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
});

let errorSpy;
beforeAll(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    errorSpy.mockRestore();
});
