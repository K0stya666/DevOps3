import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from '../BookForm';

describe('BookForm Component', () => {
  const mockBook = {
    title: 'Тестовая книга',
    author: 'Тестовый автор',
    description: 'Описание тестовой книги',
    publicationDate: '2023-01-01',
    isbn: '1234567890123',
    genre: 'Фантастика',
    availableCopies: 2,
    totalCopies: 5
  };
  
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn(e => e.preventDefault());
  const mockCancelAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен корректно отображать форму с данными книги', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={false}
        actionText="Тестовое действие"
        cancelAction={mockCancelAction}
      />
    );

    // Проверяем, что все поля формы отображаются с правильными значениями
    expect(screen.getByLabelText(/Title/i)).toHaveValue(mockBook.title);
    expect(screen.getByLabelText(/Author/i)).toHaveValue(mockBook.author);
    expect(screen.getByLabelText(/Description/i)).toHaveValue(mockBook.description);
    expect(screen.getByLabelText(/Publication Date/i)).toHaveValue(mockBook.publicationDate);
    expect(screen.getByLabelText(/ISBN/i)).toHaveValue(mockBook.isbn);
    expect(screen.getByLabelText(/Genre/i)).toHaveValue(mockBook.genre);
    expect(screen.getByLabelText(/Available Copies/i)).toHaveValue(mockBook.availableCopies.toString());
    expect(screen.getByLabelText(/Total Copies/i)).toHaveValue(mockBook.totalCopies.toString());
    
    // Проверяем кнопки
    expect(screen.getByText('Тестовое действие')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('должен вызывать обработчик изменения при изменении полей формы', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={false}
        actionText="Тестовое действие"
        cancelAction={mockCancelAction}
      />
    );

    // Изменяем значение поля заголовка
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { name: 'title', value: 'Новый заголовок' }
    });

    // Проверяем, что обработчик был вызван с правильными аргументами
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: 'title',
          value: 'Новый заголовок'
        })
      })
    );
  });

  it('должен вызывать обработчик отправки при отправке формы', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={false}
        actionText="Тестовое действие"
        cancelAction={mockCancelAction}
      />
    );

    // Отправляем форму
    fireEvent.submit(screen.getByRole('form'));

    // Проверяем, что обработчик отправки был вызван
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('должен отображать состояние загрузки', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={true}
        actionText="Тестовое действие"
        cancelAction={mockCancelAction}
      />
    );

    // Проверяем, что кнопка отправки отображает состояние загрузки
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Processing...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('должен вызывать функцию отмены при нажатии на кнопку Отмена', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={false}
        actionText="Тестовое действие"
        cancelAction={mockCancelAction}
      />
    );

    // Нажимаем на кнопку отмены
    fireEvent.click(screen.getByText('Cancel'));

    // Проверяем, что функция отмены была вызвана
    expect(mockCancelAction).toHaveBeenCalled();
  });
});