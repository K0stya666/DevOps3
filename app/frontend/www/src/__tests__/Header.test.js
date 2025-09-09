import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

// ћокируем StatusIndicator
jest.mock('../StatusIndicator', () => () => <div>Mocked Status Indicator</div>);

describe('Header Component', () => {
  it('должен отображать логотип и навигационные ссылки', () => {
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

  it('должен отображать StatusIndicator', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked Status Indicator')).toBeInTheDocument();
  });

  it('должен отображать корректные ссылки', () => {
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

  it('должен переключать мобильное меню при клике на иконку меню', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // ћеню должно быть скрыто изначально
    expect(screen.getByRole('navigation').classList).not.toContain('show');

    // Ќажимаем на иконку меню
    fireEvent.click(screen.getByClassName('menu-icon'));

    // ћеню должно отображатьс€
    expect(screen.getByRole('navigation').classList).toContain('show');

    // Ќажимаем на иконку меню снова
    fireEvent.click(screen.getByClassName('menu-icon'));

    // ћеню должно скрытьс€
    expect(screen.getByRole('navigation').classList).not.toContain('show');
  });

  it('должен скрывать меню при клике на ссылку в мобильном режиме', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // ќткрываем меню
    fireEvent.click(screen.getByClassName('menu-icon'));
    expect(screen.getByRole('navigation').classList).toContain('show');

    // Ќажимаем на ссылку
    fireEvent.click(screen.getByText('Home'));

    // ћеню должно скрытьс€
    expect(screen.getByRole('navigation').classList).not.toContain('show');
  });
});