import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// ћокаем дочерние компоненты и зависимости со стил€ми
jest.mock('../Header', () => () => <div data-testid="header">Header Mock</div>);
jest.mock('../Footer', () => () => <div data-testid="footer">Footer Mock</div>);
jest.mock('../BookList', () => () => <div data-testid="book-list">BookList Mock</div>);
jest.mock('../AddBook', () => () => <div data-testid="add-book">AddBook Mock</div>);
jest.mock('../EditBook', () => () => <div data-testid="edit-book">EditBook Mock</div>);
jest.mock('../BookDetails', () => () => <div data-testid="book-details">BookDetails Mock</div>);
jest.mock('../SearchBooks', () => () => <div data-testid="search-books">SearchBooks Mock</div>);
jest.mock('../NotFound', () => () => <div data-testid="not-found">NotFound Mock</div>);
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container">ToastContainer Mock</div>,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
// CSS будет обработан moduleNameMapper в package.json

describe('App Component Routing', () => {
  test('renders Header, Footer, and BookList on default route "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('book-list')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  test('renders AddBook component on "/books/add" route', () => {
    render(
      <MemoryRouter initialEntries={['/books/add']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('add-book')).toBeInTheDocument();
  });

   test('renders EditBook component on "/books/edit/:id" route', () => {
    render(
      <MemoryRouter initialEntries={['/books/edit/1']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('edit-book')).toBeInTheDocument();
  });

   test('renders BookDetails component on "/books/:id" route', () => {
    render(
      <MemoryRouter initialEntries={['/books/1']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('book-details')).toBeInTheDocument();
  });

  test('renders SearchBooks component on "/search" route', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('search-books')).toBeInTheDocument();
  });

   test('renders NotFound component on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/some/unknown/route']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });
});