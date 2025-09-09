import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookList from '../BookList';
import BookService from '../BookService';

// Мокируем зависимости
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../BookService', () => ({
  getAllBooks: jest.fn(),
  deleteBook: jest.fn()
}));

describe('BookList Component', () => {
  const mockBooks = [
    {
      id: 1,
      title: 'Книга 1',
      author: 'Автор 1',
      description: 'Описание книги 1',
      genre: 'Фантастика',
      availableCopies: 2,
      totalCopies: 3
    },
    {
      id: 2,
      title: 'Книга 2',
      author: 'Автор 2',
      description: 'Описание книги 2',
      genre: 'Роман',
      availableCopies: 1,
      totalCopies: 4
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Возвращаем мокированные данные по умолчанию
    BookService.getAllBooks.mockResolvedValue({ data: mockBooks });
    BookService.deleteBook.mockResolvedValue({});

    // Мокируем модальное окно для удаления
    jest.spyOn(global, 'confirm').mockImplementation(() => true);
  });

  it('должен отображать список книг после загрузки', async () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    // Сначала должен отображаться индикатор загрузки
    expect(screen.getByText('Loading books...')).toBeInTheDocument();

    // После загрузки должны отображаться книги
    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
      expect(screen.getByText('Book Library')).toBeInTheDocument();
      expect(screen.getByText('Total Books: 2')).toBeInTheDocument();
      expect(screen.getByText('Книга 1')).toBeInTheDocument();
      expect(screen.getByText('Книга 2')).toBeInTheDocument();
    });
  });

  it('должен отображать сообщение, если книги не найдены', async () => {
    BookService.getAllBooks.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No books found.')).toBeInTheDocument();
      expect(screen.getByText('Add a new book')).toBeInTheDocument();
    });
  });

  it('должен отображать ошибку, если не удалось загрузить книги', async () => {
    BookService.getAllBooks.mockRejectedValue(new Error('Ошибка загрузки'));

    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load books. Please try again later.')).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Failed to load books');
    });
  });

  it('должен открывать модальное окно удаления при нажатии на кнопку Delete', async () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
    });

    // Нажимаем на кнопку удаления для первой книги
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Проверяем, что модальное окно удаления открылось
    expect(screen.getByText('Are you sure you want to delete the book')).toBeInTheDocument();
    expect(screen.getByText(/Книга 1/)).toBeInTheDocument(); // В заголовке модального окна должно быть название книги
  });

  it('должен удалять книгу и обновлять список после подтверждения в модальном окне', async () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
    });

    // Нажимаем на кнопку удаления для первой книги
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // В модальном окне нажимаем на кнопку удаления
    const confirmDeleteButton = screen.getAllByText('Delete')[2]; // Третья кнопка Delete (в модальном окне)
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(BookService.deleteBook).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Book deleted successfully');
    });
  });

  it('должен закрывать модальное окно при нажатии на кнопку Cancel', async () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
    });

    // Нажимаем на кнопку удаления для первой книги
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Проверяем, что модальное окно открылось
    expect(screen.getByText('Are you sure you want to delete the book')).toBeInTheDocument();

    // Нажимаем на кнопку отмены в модальном окне
    fireEvent.click(screen.getByText('Cancel'));

    // Проверяем, что модальное окно закрылось
    await waitFor(() => {
      expect(screen.queryByText('Are you sure you want to delete the book')).not.toBeInTheDocument();
    });

    // Проверяем, что функция удаления не была вызвана
    expect(BookService.deleteBook).not.toHaveBeenCalled();
  });

  it('должен отображать ошибку, если не удалось удалить книгу', async () => {
    const error = new Error('Ошибка удаления');
    error.response = { data: { message: 'Не удалось удалить книгу' } };
    BookService.deleteBook.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
    });

    // Нажимаем на кнопку удаления для первой книги
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // В модальном окне нажимаем на кнопку удаления
    const confirmDeleteButton = screen.getAllByText('Delete')[2]; // Третья кнопка Delete (в модальном окне)
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(BookService.deleteBook).toHaveBeenCalledWith(1);
      expect(toast.error).toHaveBeenCalledWith('Не удалось удалить книгу');
    });
  });
});