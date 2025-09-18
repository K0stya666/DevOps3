import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BookList from '../BookList';
import BookService from '../BookService';

jest.mock('../BookService');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});
afterEach(() => {
    jest.clearAllMocks();
});

test('BookList отображает книги из API', async () => {
    const data = [{ id: 1, title: 'Clean Code', author: 'Martin' }];
    BookService.getAllBooks.mockResolvedValueOnce({ data });

    render(
        <MemoryRouter>
            <BookList />
        </MemoryRouter>
    );

    expect(await screen.findByText(/Clean Code/i)).toBeInTheDocument();
    expect(screen.getByText(/by Martin/i)).toBeInTheDocument();
    expect(BookService.getAllBooks).toHaveBeenCalledTimes(1);
});
