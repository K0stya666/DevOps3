import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from '../BookForm';

describe('BookForm Component', () => {
  const mockBook = {
    title: '�������� �����',
    author: '�������� �����',
    description: '�������� �������� �����',
    publicationDate: '2023-01-01',
    isbn: '1234567890123',
    genre: '����������',
    availableCopies: 2,
    totalCopies: 5
  };
  
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn(e => e.preventDefault());
  const mockCancelAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('������ ��������� ���������� ����� � ������� �����', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={false}
        actionText="�������� ��������"
        cancelAction={mockCancelAction}
      />
    );

    // ���������, ��� ��� ���� ����� ������������ � ����������� ����������
    expect(screen.getByLabelText(/Title/i)).toHaveValue(mockBook.title);
    expect(screen.getByLabelText(/Author/i)).toHaveValue(mockBook.author);
    expect(screen.getByLabelText(/Description/i)).toHaveValue(mockBook.description);
    expect(screen.getByLabelText(/Publication Date/i)).toHaveValue(mockBook.publicationDate);
    expect(screen.getByLabelText(/ISBN/i)).toHaveValue(mockBook.isbn);
    expect(screen.getByLabelText(/Genre/i)).toHaveValue(mockBook.genre);
    expect(screen.getByLabelText(/Available Copies/i)).toHaveValue(mockBook.availableCopies.toString());
    expect(screen.getByLabelText(/Total Copies/i)).toHaveValue(mockBook.totalCopies.toString());
    
    // ��������� ������
    expect(screen.getByText('�������� ��������')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('������ �������� ���������� ��������� ��� ��������� ����� �����', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={false}
        actionText="�������� ��������"
        cancelAction={mockCancelAction}
      />
    );

    // �������� �������� ���� ���������
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { name: 'title', value: '����� ���������' }
    });

    // ���������, ��� ���������� ��� ������ � ����������� �����������
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: 'title',
          value: '����� ���������'
        })
      })
    );
  });

  it('������ �������� ���������� �������� ��� �������� �����', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={false}
        actionText="�������� ��������"
        cancelAction={mockCancelAction}
      />
    );

    // ���������� �����
    fireEvent.submit(screen.getByRole('form'));

    // ���������, ��� ���������� �������� ��� ������
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('������ ���������� ��������� ��������', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={true}
        actionText="�������� ��������"
        cancelAction={mockCancelAction}
      />
    );

    // ���������, ��� ������ �������� ���������� ��������� ��������
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Processing...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('������ �������� ������� ������ ��� ������� �� ������ ������', () => {
    render(
      <BookForm 
        book={mockBook}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        loading={false}
        actionText="�������� ��������"
        cancelAction={mockCancelAction}
      />
    );

    // �������� �� ������ ������
    fireEvent.click(screen.getByText('Cancel'));

    // ���������, ��� ������� ������ ���� �������
    expect(mockCancelAction).toHaveBeenCalled();
  });
});