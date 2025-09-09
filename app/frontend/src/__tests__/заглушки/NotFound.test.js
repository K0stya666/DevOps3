import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NotFound from '../NotFound';
import App from '../App'; // Импортируем App для тестирования роутинга

// Мокаем компоненты, чтобы не рендерить их полностью
jest.mock('../Header', () => () => <div data-testid="header">Header Mock</div>);
jest.mock('../Footer', () => () => <div data-testid="footer">Footer Mock</div>);
jest.mock('../BookList', () => () => <div data-testid="book-list">BookList Mock</div>);
jest.mock('react-toastify', () => ({ ToastContainer: () => null, toast: {} }));


describe('NotFound Component', () => {
  test('renders NotFound content directly', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Page Not Found/i })).toBeInTheDocument();
    expect(screen.getByText(/The page you're looking for doesn't exist or has been moved./i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Go to Homepage/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  test('App component renders NotFound for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <App />
      </MemoryRouter>
    );
    // Проверяем, что контент NotFound отображается внутри App
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Page Not Found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go to Homepage/i })).toBeInTheDocument();
    // Убедимся, что другие компоненты (например, BookList) не рендерятся
    expect(screen.queryByTestId('book-list')).not.toBeInTheDocument();
  });
});