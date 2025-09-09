import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookDetails from '../BookDetails';
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
  deleteBook: jest.fn()
}));

describe('BookDetails Component', () => {
  const mockBook = {
    id: 1,
    title: '�������� �����',
    author: '�������� �����',
    description: '�������� �������� �����',
    publicationDate: '2023-01-01T00:00:00.000Z',
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
    BookService.deleteBook.mockResolvedValue({});
  });

  it('������ ���������� ��������� �������� ��� �������� ������ �����', () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading book details...')).toBeInTheDocument();
  });

  it('������ ��������� � ���������� ������ �����', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(BookService.getBookById).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
      expect(screen.getByText('Book Details')).toBeInTheDocument();
      expect(screen.getByText('�������� �����')).toBeInTheDocument();
      expect(screen.getByText(/�������� �����/)).toBeInTheDocument();
      expect(screen.getByText('�������� �������� �����')).toBeInTheDocument();
      expect(screen.getByText(/����������/)).toBeInTheDocument();
      expect(screen.getByText(/1234567890123/)).toBeInTheDocument();
    });
  });

  it('������ ���������� ������, ���� �� ������� ��������� ������ �����', async () => {
    const error = new Error('������ ��������');
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

  it('������ ��������� ��������� ���� �������� ��� ������� �� ������ Delete', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    // �������� �� ������ ��������
    fireEvent.click(screen.getByText('Delete'));

    // ���������, ��� ��������� ���� �������� ���������
    expect(screen.getByText('Are you sure you want to delete the book')).toBeInTheDocument();
    expect(screen.getByText(/"�������� �����"/)).toBeInTheDocument();
  });

  it('������ ������� ����� � �������������� �� �������� ������ ����', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    // �������� �� ������ ��������
    fireEvent.click(screen.getByText('Delete'));

    // � ��������� ���� �������� �� ������ ��������
    fireEvent.click(screen.getAllByText('Delete')[1]); // ������ ������ Delete (� ��������� ����)

    await waitFor(() => {
      expect(BookService.deleteBook).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Book deleted successfully');
      expect(navigateMock).toHaveBeenCalledWith('/books');
    });
  });

  it('������ ��������� ��������� ���� ��� ������� �� ������ Cancel', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    // �������� �� ������ ��������
    fireEvent.click(screen.getByText('Delete'));

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

  it('������ ������������� ���� ����������', async () => {
    render(
      <MemoryRouter>
        <BookDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading book details...')).not.toBeInTheDocument();
    });

    // ���������, ��� ���� ��������������� ��� ��������� ����
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });

  it('������ ���������� "Not specified" ��� ������������� ������', async () => {
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

    expect(screen.getAllByText('Not specified')).toHaveLength(2); // ISBN � Genre
    expect(screen.getByText('Unknown')).toBeInTheDocument(); // Publication Date
  });

  it('������ ���������� ������ �� ������ ���� � ��������������', async () => {
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