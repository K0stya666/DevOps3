import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchBooks from '../SearchBooks';
import BookService from '../BookService';

// �������� �����������
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
      title: '����� � ���',
      author: '��� �������',
      genre: '�����',
      isbn: '1234567890123'
    },
    {
      id: 2,
      title: '������ � ���������',
      author: '������ ��������',
      genre: '����������',
      isbn: '9876543210987'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // ������������� ������������ ������ �� ���������
    BookService.searchBooks.mockResolvedValue({ data: mockBooks });
    BookService.deleteBook.mockResolvedValue({});
  });

  it('������ ���������� ����� ������', () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    expect(screen.getByText('Search Books')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by title, author, or ISBN/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });
it('������ ��������� ����� ���� ��� �������� �����', async () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // ������ ��������� ������
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: '�����' }
    });
    
    // ���������� ����� ������
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    // ���������, ��� ������������ ��������� ��������
    expect(screen.getByText('Searching books...')).toBeInTheDocument();

    await waitFor(() => {
      expect(BookService.searchBooks).toHaveBeenCalledWith('�����');
      expect(screen.queryByText('Searching books...')).not.toBeInTheDocument();
      expect(screen.getByText('Search Results (2)')).toBeInTheDocument();
      expect(screen.getByText('����� � ���')).toBeInTheDocument();
      expect(screen.getByText('������ � ���������')).toBeInTheDocument();
    });
  });

  it('������ ���������� ������ ��� ������ ��������� �������', () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // ���������� ����� � ������ ��������
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(toast.error).toHaveBeenCalledWith('Please enter a search term');
    expect(BookService.searchBooks).not.toHaveBeenCalled();
  });

  it('������ ���������� ���������, ���� �� ������� ����', async () => {
    BookService.searchBooks.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // ������ ��������� ������
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: '�������������� �����' }
    });
    
    // ���������� ����� ������
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(BookService.searchBooks).toHaveBeenCalledWith('�������������� �����');
      expect(screen.getByText('Search Results (0)')).toBeInTheDocument();
      expect(screen.getByText('No books found matching your search criteria.')).toBeInTheDocument();
    });
  });

  it('������ ������������ ������ ��� ������ ����', async () => {
    BookService.searchBooks.mockRejectedValue(new Error('������ ��� ������'));

    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // ������ ��������� ������
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: '������' }
    });
    
    // ���������� ����� ������
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(BookService.searchBooks).toHaveBeenCalledWith('������');
      expect(toast.error).toHaveBeenCalledWith('Error searching books');
    });
  });

  it('������ ��������� ��������� ���� �������� ��� ������� �� ������ Delete', async () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // ������ ��������� ������ � ��������� �����
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: '�����' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.queryByText('Searching books...')).not.toBeInTheDocument();
    });

    // �������� �� ������ �������� ��� ������ �����
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // ���������, ��� ��������� ���� �������� ���������
    expect(screen.getByText('Are you sure you want to delete the book')).toBeInTheDocument();
    expect(screen.getByText(/����� � ���/)).toBeInTheDocument();
  });

  it('������ ������� ����� � ��������� ���������� ������', async () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // ������ ��������� ������ � ��������� �����
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: '�����' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.queryByText('Searching books...')).not.toBeInTheDocument();
    });

    // �������� �� ������ �������� ��� ������ �����
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // � ��������� ���� �������� �� ������ ��������
    const confirmDeleteButton = screen.getAllByText('Delete')[2]; // ������ ������ Delete (� ��������� ����)
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(BookService.deleteBook).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Book deleted successfully');
      
      // ����� �������� ����� �� �� ������ ���� � ����������� ������
      expect(screen.queryByText('����� � ���')).not.toBeInTheDocument();
      expect(screen.getByText('������ � ���������')).toBeInTheDocument();
    });
  });

  it('������ ������������ ������ ��� �������� �����', async () => {
    const error = new Error('������ ��������');
    error.response = { data: { message: '�� ������� ������� �����' } };
    BookService.deleteBook.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    // ������ ��������� ������ � ��������� �����
    fireEvent.change(screen.getByPlaceholderText(/Search by title, author, or ISBN/i), {
      target: { value: '�����' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.queryByText('Searching books...')).not.toBeInTheDocument();
    });

    // �������� �� ������ �������� ��� ������ �����
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // � ��������� ���� �������� �� ������ ��������
    const confirmDeleteButton = screen.getAllByText('Delete')[2]; // ������ ������ Delete (� ��������� ����)
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(BookService.deleteBook).toHaveBeenCalledWith(1);
      expect(toast.error).toHaveBeenCalledWith('�� ������� ������� �����');
    });
  });
});