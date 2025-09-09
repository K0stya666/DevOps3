import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import DeleteBookModal from '../DeleteBookModal';
import BookService from '../BookService';

// �������� �����������
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
    title: '�������� �����'
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.deleteBook.mockResolvedValue({});
  });

  it('�� ������ ������������, ���� isOpen=false', () => {
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

  it('�� ������ ������������, ���� book=null', () => {
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

  it('������ ��������� ������������, ���� isOpen=true � book �����', () => {
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
    expect(screen.getByText('�������� �����')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('������ �������� onClose ��� ������� �� ������ Close', () => {
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

  it('������ �������� onClose ��� ������� �� ������ Cancel', () => {
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

  it('������ ������� ����� � �������� onSuccess � onClose ��� ������� �� ������ Delete', async () => {
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

  it('������ ������������ ������ ��� �������� �����', async () => {
    const error = new Error('������ ��������');
    error.response = { data: { message: '�� ������� ������� �����' } };
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
      expect(toast.error).toHaveBeenCalledWith('�� ������� ������� �����');
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('������ ��������� ��������� ���� ��� ����� ��� ����', () => {
    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // ���� �� ���� ���������� ���� (modal-backdrop)
    fireEvent.click(screen.getByClassName('modal-backdrop'));
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('�� ������ ��������� ��������� ���� ��� ����� �� �������� ���������� ����', () => {
    render(
      <DeleteBookModal 
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // ���� �� ����������� ���������� ����
    fireEvent.click(screen.getByClassName('modal'));
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});