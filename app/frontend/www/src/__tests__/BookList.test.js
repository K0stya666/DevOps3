import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookList from '../BookList';
import BookService from '../BookService';

// �������� �����������
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
      title: '����� 1',
      author: '����� 1',
      description: '�������� ����� 1',
      genre: '����������',
      availableCopies: 2,
      totalCopies: 3
    },
    {
      id: 2,
      title: '����� 2',
      author: '����� 2',
      description: '�������� ����� 2',
      genre: '�����',
      availableCopies: 1,
      totalCopies: 4
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // ���������� ������������ ������ �� ���������
    BookService.getAllBooks.mockResolvedValue({ data: mockBooks });
    BookService.deleteBook.mockResolvedValue({});

    // �������� ��������� ���� ��� ��������
    jest.spyOn(global, 'confirm').mockImplementation(() => true);
  });

  it('������ ���������� ������ ���� ����� ��������', async () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    // ������� ������ ������������ ��������� ��������
    expect(screen.getByText('Loading books...')).toBeInTheDocument();

    // ����� �������� ������ ������������ �����
    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
      expect(screen.getByText('Book Library')).toBeInTheDocument();
      expect(screen.getByText('Total Books: 2')).toBeInTheDocument();
      expect(screen.getByText('����� 1')).toBeInTheDocument();
      expect(screen.getByText('����� 2')).toBeInTheDocument();
    });
  });

  it('������ ���������� ���������, ���� ����� �� �������', async () => {
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

  it('������ ���������� ������, ���� �� ������� ��������� �����', async () => {
    BookService.getAllBooks.mockRejectedValue(new Error('������ ��������'));

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

  it('������ ��������� ��������� ���� �������� ��� ������� �� ������ Delete', async () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
    });

    // �������� �� ������ �������� ��� ������ �����
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // ���������, ��� ��������� ���� �������� ���������
    expect(screen.getByText('Are you sure you want to delete the book')).toBeInTheDocument();
    expect(screen.getByText(/����� 1/)).toBeInTheDocument(); // � ��������� ���������� ���� ������ ���� �������� �����
  });

  it('������ ������� ����� � ��������� ������ ����� ������������� � ��������� ����', async () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
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
    });
  });

  it('������ ��������� ��������� ���� ��� ������� �� ������ Cancel', async () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
    });

    // �������� �� ������ �������� ��� ������ �����
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // ���������, ��� ��������� ���� ���������
    expect(screen.getByText('Are you sure you want to delete the book')).toBeInTheDocument();

    // �������� �� ������ ������ � ��������� ����
    fireEvent.click(screen.getByText('Cancel'));

    // ���������, ��� ��������� ���� ���������
    await waitFor(() => {
      expect(screen.queryByText('Are you sure you want to delete the book')).not.toBeInTheDocument();
    });

    // ���������, ��� ������� �������� �� ���� �������
    expect(BookService.deleteBook).not.toHaveBeenCalled();
  });

  it('������ ���������� ������, ���� �� ������� ������� �����', async () => {
    const error = new Error('������ ��������');
    error.response = { data: { message: '�� ������� ������� �����' } };
    BookService.deleteBook.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
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