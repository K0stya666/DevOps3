import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddBook from '../AddBook';
import BookService from '../BookService';

// �������� ��� �����������
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../BookService', () => ({
  createBook: jest.fn()
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

describe('AddBook Component', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);
    jest.clearAllMocks();
  });

  it('������ ��������� ���������� ����� ���������� �����', () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    expect(screen.getByText('Add New Book')).toBeInTheDocument();
    expect(screen.getByTestId('book-form')).toBeInTheDocument();
    expect(screen.getByText('Add Book')).toBeInTheDocument();
  });

  it('������ ��������� ��������� ����� ��� ��������� ����� �����', () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('title-input'), {
      target: { name: 'title', value: '����� �����' }
    });

    fireEvent.change(screen.getByTestId('author-input'), {
      target: { name: 'author', value: '����� �����' }
    });

    expect(screen.getByTestId('title-input')).toHaveValue('����� �����');
    expect(screen.getByTestId('author-input')).toHaveValue('����� �����');
  });

  it('������ ������������ ����� � ���������� ������', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    // ���������� ����� � ������ ����������
    fireEvent.submit(screen.getByTestId('book-form'));

    expect(toast.error).toHaveBeenCalledWith('Title is required');
    expect(BookService.createBook).not.toHaveBeenCalled();

    // ��������� ���������, �� ��������� ������ ������
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { name: 'title', value: '����� �����' }
    });
    
    fireEvent.submit(screen.getByTestId('book-form'));

    expect(toast.error).toHaveBeenCalledWith('Author is required');
    expect(BookService.createBook).not.toHaveBeenCalled();
  });

  it('������ ������������ ISBN', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    // ��������� ��������� � ������
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { name: 'title', value: '����� �����' }
    });
    
    fireEvent.change(screen.getByTestId('author-input'), {
      target: { name: 'author', value: '����� �����' }
    });

    // ��������� ������������ ISBN (������� ��������)
    fireEvent.change(screen.getByTestId('isbn-input'), {
      target: { name: 'isbn', value: '12345' }
    });
    
    fireEvent.submit(screen.getByTestId('book-form'));

    expect(toast.error).toHaveBeenCalledWith('ISBN must be 10 or 13 characters long');
    expect(BookService.createBook).not.toHaveBeenCalled();
  });

  it('������ ������������ ���������� �����', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    // ��������� ������������ ����
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { name: 'title', value: '����� �����' }
    });
    
    fireEvent.change(screen.getByTestId('author-input'), {
      target: { name: 'author', value: '����� �����' }
    });

    // ������������� ��������� ���������� ������ ������
    fireEvent.change(screen.getByTestId('available-copies-input'), {
      target: { name: 'availableCopies', value: '5' }
    });
    
    fireEvent.change(screen.getByTestId('total-copies-input'), {
      target: { name: 'totalCopies', value: '3' }
    });
    
    fireEvent.submit(screen.getByTestId('book-form'));

    expect(toast.error).toHaveBeenCalledWith('Available copies cannot exceed total copies');
    expect(BookService.createBook).not.toHaveBeenCalled();
  });

  it('������ ������� ��������� ����� � ����������� �������', async () => {
    BookService.createBook.mockResolvedValue({ data: { id: 1, title: '����� �����' } });

    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    // ��������� ��� ����������� ����
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { name: 'title', value: '����� �����' }
    });
    
    fireEvent.change(screen.getByTestId('author-input'), {
      target: { name: 'author', value: '����� �����' }
    });
    
    fireEvent.submit(screen.getByTestId('book-form'));

    await waitFor(() => {
      expect(BookService.createBook).toHaveBeenCalledWith(expect.objectContaining({
        title: '����� �����',
        author: '����� �����',
        availableCopies: 1,
        totalCopies: 1
      }));
      expect(toast.success).toHaveBeenCalledWith('Book added successfully!');
      expect(navigateMock).toHaveBeenCalledWith('/books');
    });
  });

  it('������ ������������ ������ ��� �������� �����', async () => {
    const error = new Error('������ �������');
    error.response = { data: { message: '�� ������� ������� �����' } };
    BookService.createBook.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    // ��������� ��� ����������� ����
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { name: 'title', value: '����� �����' }
    });
    
    fireEvent.change(screen.getByTestId('author-input'), {
      target: { name: 'author', value: '����� �����' }
    });
    
    fireEvent.submit(screen.getByTestId('book-form'));

    await waitFor(() => {
      expect(BookService.createBook).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('�� ������� ������� �����');
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  it('������ �������� ��������� ��� ������� �� ������ ������', () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Cancel'));
    
    expect(navigateMock).toHaveBeenCalledWith('/books');
  });
});