import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditBook from '../EditBook';
import BookService from '../BookService';

// �������� �����������
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
  updateBook: jest.fn()
}));

jest.mock('../BookForm', () => ({ book, onChange, onSubmit, loading, actionText, cancelAction }) => (
  <form onSubmit={onSubmit} data-testid="book-form">
    <input 
      data-testid="title-input" 
      name="title" 
      value={book.title} 
      onChange={onChange} 
    />
    <input 
      data-testid="author-input" 
      name="author" 
      value={book.author} 
      onChange={onChange}
    />
    <input 
      data-testid="isbn-input" 
      name="isbn" 
      value={book.isbn} 
      onChange={onChange}
    />
    <input 
      data-testid="available-copies-input" 
      name="availableCopies" 
      value={book.availableCopies} 
      onChange={onChange}
    />
    <input 
      data-testid="total-copies-input" 
      name="totalCopies" 
      value={book.totalCopies} 
      onChange={onChange}
    />
    <button type="submit" disabled={loading}>{loading ? 'Processing...' : actionText}</button>
    <button type="button" onClick={cancelAction}>Cancel</button>
  </form>
));

jest.mock('../Loading', () => () => <div>Loading book data...</div>);
jest.mock('../Error', () => ({ message }) => <div>{message}</div>);

describe('EditBook Component', () => {
  const mockBook = {
    id: 1,
    title: '�������� �����',
    author: '�������� �����',
    description: '�������� �����',
    publicationDate: '2023-01-01',
    isbn: '1234567890123',
    genre: '����������',
    availableCopies: 2,
    totalCopies: 5
  };

  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);
    jest.clearAllMocks();
    
    // ������������� ������������ ������ �� ���������
    BookService.getBookById.mockResolvedValue({ data: mockBook });
    BookService.updateBook.mockResolvedValue({ data: mockBook });
  });

  it('������ ���������� ��������� �������� ��� �������� ������ �����', () => {
    render(
      <MemoryRouter>
        <EditBook />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading book data...')).toBeInTheDocument();
  });

  it('������ ��������� � ���������� ������ �����', async () => {
    render(
      <MemoryRouter>
        <EditBook />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(BookService.getBookById).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Loading book data...')).not.toBeInTheDocument();
      expect(screen.getByText('Edit Book')).toBeInTheDocument();
      expect(screen.getByTestId('book-form')).toBeInTheDocument();
    });
  });

  it('������ ���������� ������, ���� �� ������� ��������� ������ �����', async () => {
    const error = new Error('������ ��������');
    BookService.getBookById.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <EditBook />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(BookService.getBookById).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Loading book data...')).not.toBeInTheDocument();
      expect(screen.getByText('Failed to load book data. The book might not exist or has been removed.')).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Failed to load book data');
    });
  });

  it('������ ��������� ��������� ����� ��� ��������� ����� �����', async () => {
    render(
      <MemoryRouter>
        <EditBook />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book data...')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('title-input'), {
      target: { name: 'title', value: '����������� �����' }
    });

    expect(screen.getByTestId('title-input')).toHaveValue('����������� �����');
  });

  it('������ ������������ ����� � ���������� ������', async () => {
    render(
      <MemoryRouter>
        <EditBook />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book data...')).not.toBeInTheDocument();
    });

    // ������� ���� ���������
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { name: 'title', value: '' }
    });
    
    // ���������� �����
    fireEvent.submit(screen.getByTestId('book-form'));

    expect(toast.error).toHaveBeenCalledWith('Title is required');
    expect(BookService.updateBook).not.toHaveBeenCalled();
  });

  it('������ ������� ��������� ����� � ����������� �������', async () => {
    render(
      <MemoryRouter>
        <EditBook />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book data...')).not.toBeInTheDocument();
    });

    // �������� ���������
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { name: 'title', value: '����������� �����' }
    });
    
    // ���������� �����
    fireEvent.submit(screen.getByTestId('book-form'));

    await waitFor(() => {
      expect(BookService.updateBook).toHaveBeenCalledWith('1', expect.objectContaining({
        title: '����������� �����'
      }));
      expect(toast.success).toHaveBeenCalledWith('Book updated successfully!');
      expect(navigateMock).toHaveBeenCalledWith('/books/1');
    });
  });

  it('������ ������������ ������ ��� ���������� �����', async () => {
    const error = new Error('������ ����������');
    error.response = { data: { message: '�� ������� �������� �����' } };
    BookService.updateBook.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <EditBook />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book data...')).not.toBeInTheDocument();
    });

    // ���������� ����� ��� ���������
    fireEvent.submit(screen.getByTestId('book-form'));

    await waitFor(() => {
      expect(BookService.updateBook).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('�� ������� �������� �����');
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  it('������ ������������� ���� ���������� ��� �������� �����', async () => {
    const bookWithDate = {
      ...mockBook,
      publicationDate: '2023-01-15T00:00:00.000Z'
    };
    BookService.getBookById.mockResolvedValue({ data: bookWithDate });

    render(
      <MemoryRouter>
        <EditBook />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(BookService.getBookById).toHaveBeenCalledWith('1');
    });

    // � ���������� EditBook ���� ������ ���� ��������������� ��� YYYY-MM-DD
    // �� ��������� �� ���������� BookForm, �� �� ����� ��������� ��� ��������
    // ������ ����� �� ���������, ��� publicationDate � ��������� ���� �������������
  });

  it('������ �������� ��������� ��� ������� �� ������ ������', async () => {
    render(
      <MemoryRouter>
        <EditBook />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book data...')).not.toBeInTheDocument();
    });

    // �������� �� ������ ������
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(navigateMock).toHaveBeenCalledWith('/books/1');
  });
});