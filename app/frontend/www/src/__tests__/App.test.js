import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// �������� ��� ����������, ������������ � App
jest.mock('../Header', () => () => <div>Mocked Header</div>);
jest.mock('../Footer', () => () => <div>Mocked Footer</div>);
jest.mock('../BookList', () => () => <div>Mocked BookList</div>);
jest.mock('../AddBook', () => () => <div>Mocked AddBook</div>);
jest.mock('../EditBook', () => () => <div>Mocked EditBook</div>);
jest.mock('../BookDetails', () => () => <div>Mocked BookDetails</div>);
jest.mock('../SearchBooks', () => () => <div>Mocked SearchBooks</div>);
jest.mock('../NotFound', () => () => <div>Mocked NotFound</div>);

describe('App Component', () => {
  it('������ ���������� ��������� � ������ �� ���� ���������', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
    expect(screen.getByText('Mocked Footer')).toBeInTheDocument();
  });

  it('������ ���������� BookList �� �������� ��������', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked BookList')).toBeInTheDocument();
  });

  it('������ ���������� BookList �� �������� /books', () => {
    render(
      <MemoryRouter initialEntries={['/books']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked BookList')).toBeInTheDocument();
  });

  it('������ ���������� AddBook �� �������� /books/add', () => {
    render(
      <MemoryRouter initialEntries={['/books/add']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked AddBook')).toBeInTheDocument();
  });

  it('������ ���������� EditBook �� �������� /books/edit/:id', () => {
    render(
      <MemoryRouter initialEntries={['/books/edit/1']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked EditBook')).toBeInTheDocument();
  });

  it('������ ���������� BookDetails �� �������� /books/:id', () => {
    render(
      <MemoryRouter initialEntries={['/books/1']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked BookDetails')).toBeInTheDocument();
  });

  it('������ ���������� SearchBooks �� �������� /search', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked SearchBooks')).toBeInTheDocument();
  });

  it('������ ���������� NotFound �� �������������� ��������', () => {
    render(
      <MemoryRouter initialEntries={['/������������-�������']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked NotFound')).toBeInTheDocument();
  });
});