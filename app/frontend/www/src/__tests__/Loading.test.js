import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading Component', () => {
  it('должен отображать сообщение по умолчанию', () => {
    render(<Loading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Используем querySelector вместо getByClassName
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('должен отображать пользовательское сообщение', () => {
    const customMessage = 'Загрузка данных...';
    
    render(<Loading message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    // Используем querySelector вместо getByClassName
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});