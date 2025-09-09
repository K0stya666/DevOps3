import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteBookModal from '../DeleteBookModal'; // Убедитесь, что путь правильный
import BookService from '../BookService';
import { toast } from 'react-toastify';

// Мокаем зависимости
jest.mock('../BookService');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe('DeleteBookModal Component', () => {
  const mockBook = {
    id: '10',
    title: 'Book to Delete',
    author: 'Some Author',
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.deleteBook.mockResolvedValue({}); // Мок успешного удаления
  });

  test('renders nothing if isOpen is false', () => {
    render(
      <DeleteBookModal
        book={mockBook}
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.queryByRole('heading', { name: /Delete Book/i })).not.toBeInTheDocument();
  });

  test('renders nothing if book is null', () => {
    render(
      <DeleteBookModal
        book={null}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.queryByRole('heading', { name: /Delete Book/i })).not.toBeInTheDocument();
  });

  test('renders modal correctly when open and book is provided', () => {
    render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('heading', { name: /Delete Book/i })).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete the book/i)).toBeInTheDocument();
    expect(screen.getByText(mockBook.title)).toBeInTheDocument(); // Проверяем наличие названия книги
    expect(screen.getByText(/This action cannot be undone./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(BookService.deleteBook).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test('calls onClose when clicking outside the modal (on backdrop)', async () => {
     const user = userEvent.setup();
     render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    // Кликаем на элемент с классом modal-backdrop (родительский)
    // eslint-disable-next-line testing-library/no-node-access
    await user.click(screen.getByRole('heading', { name: /Delete Book/i }).closest('.modal-backdrop'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when clicking inside the modal content', async () => {
     const user = userEvent.setup();
     render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
     // Кликаем на заголовок внутри модалки
     await user.click(screen.getByRole('heading', { name: /Delete Book/i }));
     expect(mockOnClose).not.toHaveBeenCalled();
   });


  test('calls BookService.deleteBook, onSuccess, and onClose when Delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByRole('button', { name: /Delete/i }));

    // Проверяем вызов сервиса
    await waitFor(() => {
      expect(BookService.deleteBook).toHaveBeenCalledTimes(1);
      expect(BookService.deleteBook).toHaveBeenCalledWith(mockBook.id);
    });

    // Проверяем вызовы колбэков и тоста
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Book deleted successfully');
    });
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
     await waitFor(() => {
       expect(mockOnClose).toHaveBeenCalledTimes(1);
     });

  });

  test('shows error toast and does not call onSuccess/onClose if deleteBook fails', async () => {
     const user = userEvent.setup();
    const apiError = { response: { data: { message: 'Deletion Failed' } } };
    BookService.deleteBook.mockRejectedValue(apiError); // Мок ошибки

     render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

     await user.click(screen.getByRole('button', { name: /Delete/i }));

     await waitFor(() => {
       expect(BookService.deleteBook).toHaveBeenCalledTimes(1);
     });

     await waitFor(() => {
       expect(toast.error).toHaveBeenCalledWith('Deletion Failed');
     });

     // Успешные колбэки не должны вызываться
     expect(mockOnSuccess).not.toHaveBeenCalled();
     expect(mockOnClose).not.toHaveBeenCalled(); // onClose не вызывается в блоке catch
     expect(toast.success).not.toHaveBeenCalled();
  });

   test('shows generic error toast if deleteBook fails without specific message', async () => {
     const user = userEvent.setup();
    const genericError = new Error('Network Error'); // Ошибка без response.data.message
    BookService.deleteBook.mockRejectedValue(genericError);

     render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

     await user.click(screen.getByRole('button', { name: /Delete/i }));

     await waitFor(() => {
       expect(BookService.deleteBook).toHaveBeenCalledTimes(1);
     });

     await waitFor(() => {
       expect(toast.error).toHaveBeenCalledWith('Failed to delete book');
     });

     expect(mockOnSuccess).not.toHaveBeenCalled();
     expect(mockOnClose).not.toHaveBeenCalled();
     expect(toast.success).not.toHaveBeenCalled();
  });
});