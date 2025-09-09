import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Error from '../Error';

describe('Error Component', () => {
  test('renders the error message provided', () => {
    const errorMessage = 'Something went terribly wrong!';
    render(
      <MemoryRouter>
        <Error message={errorMessage} />
      </MemoryRouter>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('??')).toBeInTheDocument();
  });

  test('renders the default back link correctly', () => {
    const errorMessage = 'Error occurred.';
    render(
      <MemoryRouter>
        <Error message={errorMessage} />
      </MemoryRouter>
    );
    const backLink = screen.getByRole('link', { name: /Back to Books/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/books');
  });

  test('renders a custom back link correctly', () => {
    const errorMessage = 'Another error.';
    const customLink = '/dashboard';
    const customText = 'Go to Dashboard';
    render(
      <MemoryRouter>
        <Error message={errorMessage} backLink={customLink} backText={customText} />
      </MemoryRouter>
    );
    const backLink = screen.getByRole('link', { name: customText });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', customLink);
  });
});