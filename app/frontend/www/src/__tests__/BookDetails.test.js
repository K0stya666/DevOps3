import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookDetails from '../BookDetails';
import BookService from '../BookService';

// Мокируем зависимости
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../BookService', () => ({
  getBookById: jest.fn(),
  deleteBook: jest.fn()
}));

describe('BookDetails Component', () => {
  const mockBook = {
    id: 1,
    title: 'Тестовая книга',
    author: 'Тестовый автор',
    description: 'Описание тестовой книги',
    publicationDate: '2023-01-01T00:00:00.000Z',
    isbn: '1234567890123',
    genre: 'Фантастика',
    availableCopies: 2,
    totalCopies: 5
  };

  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);
    jest.clearAllMocks();
    
    // Устанавливаем мокированные данные по умолчанию
    BookService.getBookById.mockResolvedValue({ data: mockBook });
    BookService.deleteBook.mockResolvedValue({});
  });

  it('должен отображать индикатор загрузки при загрузке данных книги', () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading book details...')).toBeInTheDocument();
  });

  it('должен загружать и отображать детали книги', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(BookService.getBookById).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
      expect(screen.getByText('Book Details')).toBeInTheDocument();
      expect(screen.getByText('Тестовая книга')).toBeInTheDocument();
      expect(screen.getByText(/Тестовый автор/)).toBeInTheDocument();
      expect(screen.getByText('Описание тестовой книги')).toBeInTheDocument();
      expect(screen.getByText(/Фантастика/)).toBeInTheDocument();
      expect(screen.getByText(/1234567890123/)).toBeInTheDocument();
    });
  });

  it('должен отображать ошибку, если не удалось загрузить данные книги', async () => {
    const error = new Error('Ошибка загрузки');
    BookService.getBookById.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(BookService.getBookById).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
      expect(screen.getByText('Failed to load book details. The book might not exist or has been removed.')).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Failed to load book details');
    });
  });

  it('должен открывать модальное окно удаления при нажатии на кнопку Delete', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    // Нажимаем на кнопку удаления
    fireEvent.click(screen.getByText('Delete'));

    // Проверяем, что модальное окно удаления открылось
    expect(screen.getByText('Are you sure you want to delete the book')).toBeInTheDocument();
    expect(screen.getByText(/"Тестовая книга"/)).toBeInTheDocument();
  });

  it('должен удалять книгу и перенаправлять на страницу списка книг', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    // Нажимаем на кнопку удаления
    fireEvent.click(screen.getByText('Delete'));

    // В модальном окне нажимаем на кнопку удаления
    fireEvent.click(screen.getAllByText('Delete')[1]); // Вторая кнопка Delete (в модальном окне)

    await waitFor(() => {
      expect(BookService.deleteBook).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Book deleted successfully');
      expect(navigateMock).toHaveBeenCalledWith('/books');
    });
  });

  it('должен закрывать модальное окно при нажатии на кнопку Cancel', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    // Нажимаем на кнопку удаления
    fireEvent.click(screen.getByText('Delete'));

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

  it('должен форматировать дату публикации', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    // Проверяем, что дата отформатирована как локальная дата
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });

  it('должен отображать "Not specified" для отсутствующих данных', async () => {
    const bookWithMissingData = {
      ...mockBook,
      isbn: undefined,
      genre: undefined,
      publicationDate: undefined
    };
    BookService.getBookById.mockResolvedValue({ data: bookWithMissingData });

    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    expect(screen.getAllByText('Not specified')).toHaveLength(2); // ISBN и Genre
    expect(screen.getByText('Unknown')).toBeInTheDocument(); // Publication Date
  });

  it('должен отображать ссылки на список книг и редактирование', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Back to Books').closest('a')).toHaveAttribute('href', '/books');
    expect(screen.getByText('Edit').closest('a')).toHaveAttribute('href', '/books/edit/1');
  });
});