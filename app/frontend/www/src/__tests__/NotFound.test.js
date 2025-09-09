import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../NotFound';

describe('NotFound Component', () => {
  it('должен отображать сообщение 404', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist or has been moved.")).toBeInTheDocument();
  });

  it('должен отображать кнопку возврата на главную страницу', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    const homeButton = screen.getByText('Go to Homepage');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton.closest('a')).toHaveAttribute('href', '/');
  });
});