import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

// �������� StatusIndicator
jest.mock('../StatusIndicator', () => () => <div>Mocked Status Indicator</div>);

describe('Header Component', () => {
  it('������ ���������� ������� � ������������� ������', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('?? Library MS')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('All Books')).toBeInTheDocument();
    expect(screen.getByText('Add Book')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('������ ���������� StatusIndicator', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked Status Indicator')).toBeInTheDocument();
  });

  it('������ ���������� ���������� ������', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('?? Library MS').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('All Books').closest('a')).toHaveAttribute('href', '/books');
    expect(screen.getByText('Add Book').closest('a')).toHaveAttribute('href', '/books/add');
    expect(screen.getByText('Search').closest('a')).toHaveAttribute('href', '/search');
  });

  it('������ ����������� ��������� ���� ��� ����� �� ������ ����', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // ���� ������ ���� ������ ����������
    expect(screen.getByRole('navigation').classList).not.toContain('show');

    // �������� �� ������ ����
    fireEvent.click(screen.getByClassName('menu-icon'));

    // ���� ������ ������������
    expect(screen.getByRole('navigation').classList).toContain('show');

    // �������� �� ������ ���� �����
    fireEvent.click(screen.getByClassName('menu-icon'));

    // ���� ������ ��������
    expect(screen.getByRole('navigation').classList).not.toContain('show');
  });

  it('������ �������� ���� ��� ����� �� ������ � ��������� ������', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // ��������� ����
    fireEvent.click(screen.getByClassName('menu-icon'));
    expect(screen.getByRole('navigation').classList).toContain('show');

    // �������� �� ������
    fireEvent.click(screen.getByText('Home'));

    // ���� ������ ��������
    expect(screen.getByRole('navigation').classList).not.toContain('show');
  });
});