import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchBooks from '../SearchBooks';
import BookService from '../BookService';

// Мокируем зависимости
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../BookService', () => ({
  searchBooks: jest.fn(),
  deleteBook: jest.fn()
}));

describe('SearchBooks Component', () => {
  const mockBooks = [
    {
      id: 1,
      title: 'Война и мир',
      author: 'Лев Толстой',
      genre: 'Роман',
      isbn: '1234567890123'
    },
    {
      id: 2,
      title: 'Мастер и Маргарита',
      author: 'Михаил Булгаков',
      genre: 'Фантастика',
      isbn: '9876543210987'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Устанавливаем мокированные данные по умолчанию
    BookService.searchBooks.mockResolvedValue({ data: mockBooks });
    BookService.deleteBook.mockResolvedValue({});
  });

  it('должен отображать форму поиска', () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    expect(screen.getByText('Search Books')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by title, author, or ISBN/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });
it('должен выполнять поиск книг при отправке формы', async () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // Вводим поисковый запрос
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: 'война' }
    });
    
    // Отправляем форму поиска
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    // Проверяем, что отображается индикатор загрузки
    expect(screen.getByText('Searching books...')).toBeInTheDocument();

    await waitFor(() => {
      expect(BookService.searchBooks).toHaveBeenCalledWith('война');
      expect(screen.queryByText('Searching books...')).not.toBeInTheDocument();
      expect(screen.getByText('Search Results (2)')).toBeInTheDocument();
      expect(screen.getByText('Война и мир')).toBeInTheDocument();
      expect(screen.getByText('Мастер и Маргарита')).toBeInTheDocument();
    });
  });

  it('должен показывать ошибку при пустом поисковом запросе', () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // Отправляем форму с пустым запросом
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(toast.error).toHaveBeenCalledWith('Please enter a search term');
    expect(BookService.searchBooks).not.toHaveBeenCalled();
  });

  it('должен отображать сообщение, если не найдено книг', async () => {
    BookService.searchBooks.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // Вводим поисковый запрос
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: 'несуществующая книга' }
    });
    
    // Отправляем форму поиска
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(BookService.searchBooks).toHaveBeenCalledWith('несуществующая книга');
      expect(screen.getByText('Search Results (0)')).toBeInTheDocument();
      expect(screen.getByText('No books found matching your search criteria.')).toBeInTheDocument();
    });
  });

  it('должен обрабатывать ошибки при поиске книг', async () => {
    BookService.searchBooks.mockRejectedValue(new Error('Ошибка при поиске'));

    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // Вводим поисковый запрос
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: 'запрос' }
    });
    
    // Отправляем форму поиска
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(BookService.searchBooks).toHaveBeenCalledWith('запрос');
      expect(toast.error).toHaveBeenCalledWith('Error searching books');
    });
  });

  it('должен открывать модальное окно удаления при нажатии на кнопку Delete', async () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // Вводим поисковый запрос и выполняем поиск
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: 'война' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.queryByText('Searching books...')).not.toBeInTheDocument();
    });

    // Нажимаем на кнопку удаления для первой книги
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Проверяем, что модальное окно удаления открылось
    expect(screen.getByText('Are you sure you want to delete the book')).toBeInTheDocument();
    expect(screen.getByText(/Война и мир/)).toBeInTheDocument();
  });

  it('должен удалять книгу и обновлять результаты поиска', async () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // Вводим поисковый запрос и выполняем поиск
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: 'война' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.queryByText('Searching books...')).not.toBeInTheDocument();
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
      
      // После удаления книги ее не должно быть в результатах поиска
      expect(screen.queryByText('Война и мир')).not.toBeInTheDocument();
      expect(screen.getByText('Мастер и Маргарита')).toBeInTheDocument();
    });
  });

  it('должен обрабатывать ошибки при удалении книги', async () => {
    const error = new Error('Ошибка удаления');
    error.response = { data: { message: 'Не удалось удалить книгу' } };
    BookService.deleteBook.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // Вводим поисковый запрос и выполняем поиск
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: 'война' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.queryByText('Searching books...')).not.toBeInTheDocument();
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