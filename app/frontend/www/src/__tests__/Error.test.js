import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Error from '../Error';

describe('Error Component', () => {
  it('должен отображать сообщение об ошибке', () => {
    const errorMessage = 'Тестовая ошибка';
    
    render(
      <MemoryRouter>
        <Error message={errorMessage} />
      </MemoryRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Back to Books')).toBeInTheDocument();
    expect(screen.getByText('Back to Books').closest('a')).toHaveAttribute('href', '/books');
  });

  it('должен отображать иконку предупреждения', () => {
    render(
      <MemoryRouter>
        <Error message="Ошибка" />
      </MemoryRouter>
    );

    expect(screen.getByText('??')).toBeInTheDocument();
  });

  it('должен использовать пользовательскую ссылку и текст, если они предоставлены', () => {
    const customLink = '/custom-link';
    const customText = 'Вернуться на главную';
    
    render(
      <MemoryRouter>
        <Error 
          message="Ошибка" 
          backLink={customLink} 
          backText={customText} 
        />
      </MemoryRouter>
    );

    expect(screen.getByText(customText)).toBeInTheDocument();
    expect(screen.getByText(customText).closest('a')).toHaveAttribute('href', customLink);
  });
});