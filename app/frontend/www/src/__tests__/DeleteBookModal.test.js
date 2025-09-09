import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import DeleteBookModal from '../DeleteBookModal';
import BookService from '../BookService';

// Мокируем зависимости
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../BookService', () => ({
  deleteBook: jest.fn()
}));

describe('DeleteBookModal Component', () => {
  const mockBook = {
    id: 1,
    title: 'Тестовая книга'
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.deleteBook.mockResolvedValue({});
  });

  it('не должен отображаться, если isOpen=false', () => {
    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText('Delete Book')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to delete the book')).not.toBeInTheDocument();
  });

  it('не должен отображаться, если book=null', () => {
    render(
      <DeleteBookModal 
        book={null}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText('Delete Book')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to delete the book')).not.toBeInTheDocument();
  });

  it('должен корректно отображаться, если isOpen=true и book задан', () => {
    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Delete Book')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete the book/)).toBeInTheDocument();
    expect(screen.getByText('Тестовая книга')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('должен вызывать onClose при нажатии на кнопку Close', () => {
    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '?' }));
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('должен вызывать onClose при нажатии на кнопку Cancel', () => {
    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('должен удалять книгу и вызывать onSuccess и onClose при нажатии на кнопку Delete', async () => {
    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      expect(BookService.deleteBook).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Book deleted successfully');
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('должен обрабатывать ошибки при удалении книги', async () => {
    const error = new Error('Ошибка удаления');
    error.response = { data: { message: 'Не удалось удалить книгу' } };
    BookService.deleteBook.mockRejectedValue(error);

    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      expect(BookService.deleteBook).toHaveBeenCalledWith(1);
      expect(toast.error).toHaveBeenCalledWith('Не удалось удалить книгу');
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('должен закрывать модальное окно при клике вне окна', () => {
    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Клик по фону модального окна (modal-backdrop)
    fireEvent.click(screen.getByClassName('modal-backdrop'));
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('не должен закрывать модальное окно при клике по контенту модального окна', () => {
    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Клик по содержимому модального окна
    fireEvent.click(screen.getByClassName('modal'));
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});