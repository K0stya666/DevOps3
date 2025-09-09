import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../BookCard';

describe('BookCard Component', () => {
  // Используем английские тексты вместо русских
  const mockBook = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test description for this book that should be truncated in the component',
    genre: 'Fiction',
    availableCopies: 2,
    totalCopies: 5
  };
  
  const mockOnDelete = jest.fn();

  it('should display book information', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );
    
    // Используем регулярные выражения для гибкого поиска текста
    expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument();
    
    // Проверяем доступность основных элементов
    expect(screen.getByText(/Fiction/i)).toBeInTheDocument();
    expect(screen.getByText(/2\/5 available/i)).toBeInTheDocument();
    
    // Проверяем наличие кнопок
    expect(screen.getByRole('link', { name: /View/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should truncate long descriptions', () => {
    const longDescBook = {
      ...mockBook,
      description: 'This is a very long description that should be truncated. '.repeat(10)
    };
    
    render(
      <MemoryRouter>
        <BookCard book={longDescBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );
    
    // Проверяем, что описание обрезано и содержит "..."
    expect(screen.getByText(/This is a very long description/)).toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });
});