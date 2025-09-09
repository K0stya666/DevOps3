import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Мокируем все компоненты, используемые в App
jest.mock('../Header', () => () => <div>Mocked Header</div>);
jest.mock('../Footer', () => () => <div>Mocked Footer</div>);
jest.mock('../BookList', () => () => <div>Mocked BookList</div>);
jest.mock('../AddBook', () => () => <div>Mocked AddBook</div>);
jest.mock('../EditBook', () => () => <div>Mocked EditBook</div>);
jest.mock('../BookDetails', () => () => <div>Mocked BookDetails</div>);
jest.mock('../SearchBooks', () => () => <div>Mocked SearchBooks</div>);
jest.mock('../NotFound', () => () => <div>Mocked NotFound</div>);

describe('App Component', () => {
  it('должен отображать заголовок и подвал на всех маршрутах', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
    expect(screen.getByText('Mocked Footer')).toBeInTheDocument();
  });

  it('должен отображать BookList на корневом маршруте', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked BookList')).toBeInTheDocument();
  });

  it('должен отображать BookList на маршруте /books', () => {
    render(
      <MemoryRouter initialEntries={['/books']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked BookList')).toBeInTheDocument();
  });

  it('должен отображать AddBook на маршруте /books/add', () => {
    render(
      <MemoryRouter initialEntries={['/books/add']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked AddBook')).toBeInTheDocument();
  });

  it('должен отображать EditBook на маршруте /books/edit/:id', () => {
    render(
      <MemoryRouter initialEntries={['/books/edit/1']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked EditBook')).toBeInTheDocument();
  });

  it('должен отображать BookDetails на маршруте /books/:id', () => {
    render(
      <MemoryRouter initialEntries={['/books/1']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked BookDetails')).toBeInTheDocument();
  });

  it('должен отображать SearchBooks на маршруте /search', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked SearchBooks')).toBeInTheDocument();
  });

  it('должен отображать NotFound на несуществующем маршруте', () => {
    render(
      <MemoryRouter initialEntries={['/некорректный-маршрут']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked NotFound')).toBeInTheDocument();
  });
});