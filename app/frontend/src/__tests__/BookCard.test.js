import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../BookCard'; // �������, ��� ���� ����������

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

describe('BookCard Component', () => {
  // ������� ������ ��� ����� � ������� ���������
  const mockBookLongDesc = {
    id: '1',
    title: 'Long Description Book',
    author: 'Author One',
    description: 'This is a very long description designed specifically to exceed the one hundred character limit, thus ensuring that the truncation logic with ellipsis is properly triggered and tested.',
    genre: 'Fiction',
    availableCopies: 5,
    totalCopies: 10,
  };

  // ������� ������ ��� ����� � �������� ���������
  const mockBookShortDesc = {
    id: '2',
    title: 'Short Description Book',
    author: 'Author Two',
    description: 'A short description.',
    genre: 'Non-Fiction',
    availableCopies: 3,
    totalCopies: 5,
  };

  // ������� ������ ��� ����� ��� ��������
  const mockBookNoDesc = {
    id: '3',
    title: 'No Description Book',
    author: 'Author Three',
    description: '', // ������ ��������
    genre: 'Mystery',
    availableCopies: 1,
    totalCopies: 1,
  };

   // ������� ������ ��� ����� � null ���������
   const mockBookNullDesc = {
    id: '4',
    title: 'Null Description Book',
    author: 'Author Four',
    description: null, // null ��������
    genre: 'Sci-Fi',
    availableCopies: 0,
    totalCopies: 2,
  };

  // ������� ������ ��� ����� � �����
  const mockBookMinimal = {
    id: '5',
    title: 'Minimal Book',
    author: 'Author Five',
    description: 'Minimal description.',
    genre: null,
    availableCopies: null,
    totalCopies: null,
  };


  const mockOnDelete = jest.fn();

  // �������-������ ��� ������� � ��������
  const renderWithRouter = (book) => {
    // ���������� container ��� querySelector
    const utils = render(
      <MemoryRouter>
        <BookCard book={book} onDelete={mockOnDelete} />
      </MemoryRouter>
    );
    return { ...utils, container: utils.container };
  };


  // ����� ����� ����� ������ ������
  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  // --- ����� ���������� ������� ���������� ---

  it('should render book title', () => {
    renderWithRouter(mockBookLongDesc);
    expect(screen.getByText(mockBookLongDesc.title)).toBeInTheDocument();
  });

  it('should render book author', () => {
    renderWithRouter(mockBookLongDesc);
    expect(screen.getByText(`by ${mockBookLongDesc.author}`)).toBeInTheDocument();
  });

  it('should render first letter of title in cover icon', () => {
    renderWithRouter(mockBookLongDesc);
    // ���� ������ �� ������ � ��������� ����� ������
    const coverIcon = screen.getByText(mockBookLongDesc.title.charAt(0));
    expect(coverIcon).toBeInTheDocument();
    expect(coverIcon).toHaveClass('book-cover-icon');
   });


  // --- ����� ���������� �������� ---

  it('should render truncated description if description is long', () => {
    const { container } = renderWithRouter(mockBookLongDesc);
    const expectedTruncatedDesc = mockBookLongDesc.description.substring(0, 100) + '...';
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const descriptionElement = container.querySelector('p.book-description');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveTextContent(expectedTruncatedDesc);
  });

  it('should render full description if description is short', () => {
    const { container } = renderWithRouter(mockBookShortDesc);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const descriptionElement = container.querySelector('p.book-description');
    expect(descriptionElement).toBeInTheDocument();
    // ��������� ������ ���������� ������
    expect(descriptionElement).toHaveTextContent(mockBookShortDesc.description);
    // ������������� ��������, ��� ��� ���������� � �����
    expect(descriptionElement.textContent).not.toMatch(/\.\.\.$/);
  });

  it('should render "No description available" if description is empty string', () => {
    const { container } = renderWithRouter(mockBookNoDesc);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const descriptionElement = container.querySelector('p.book-description');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveTextContent('No description available');
  });

  it('should render "No description available" if description is null', () => {
    const { container } = renderWithRouter(mockBookNullDesc);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const descriptionElement = container.querySelector('p.book-description');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveTextContent('No description available');
  });


  // --- ����� ���������� ����-���������� (����, �����) ---

  it('should render genre when available', () => {
    renderWithRouter(mockBookLongDesc);
    expect(screen.getByText(mockBookLongDesc.genre)).toBeInTheDocument();
    expect(screen.getByText(mockBookLongDesc.genre)).toHaveClass('book-genre');
  });

  it('should render "Not specified" if genre is missing or null', () => {
    renderWithRouter(mockBookMinimal);
    expect(screen.getByText('Not specified')).toBeInTheDocument();
    expect(screen.getByText('Not specified')).toHaveClass('book-genre');
  });

  it('should render available and total copies when available', () => {
    renderWithRouter(mockBookLongDesc);
    const expectedText = `${mockBookLongDesc.availableCopies}/${mockBookLongDesc.totalCopies} available`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
     expect(screen.getByText(expectedText)).toHaveClass('book-copies');
  });

  it('should render 0/0 copies if copies are missing or null', () => {
    renderWithRouter(mockBookMinimal);
    const expectedText = `0/0 available`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.getByText(expectedText)).toHaveClass('book-copies');
  });


  // --- ����� ������ � ������ ---

  it('should render View link pointing to correct URL', () => {
    renderWithRouter(mockBookLongDesc);
    const viewLink = screen.getByRole('link', { name: /View/i });
    expect(viewLink).toBeInTheDocument();
    expect(viewLink).toHaveAttribute('href', `/books/${mockBookLongDesc.id}`);
  });

  it('should render Edit link pointing to correct URL', () => {
    renderWithRouter(mockBookLongDesc);
    const editLink = screen.getByRole('link', { name: /Edit/i });
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute('href', `/books/edit/${mockBookLongDesc.id}`);
  });

  it('should render Delete button', () => {
    renderWithRouter(mockBookLongDesc);
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('should call onDelete with book id when Delete button is clicked', () => {
    renderWithRouter(mockBookLongDesc);
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton); // ���������� fireEvent ��� �������� �����
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockBookLongDesc.id);
  });

});