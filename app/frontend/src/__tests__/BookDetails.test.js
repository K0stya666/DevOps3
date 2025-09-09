import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BookDetails from '../BookDetails';
import BookService from '../BookService';
import { toast } from 'react-toastify';

// Мокаем зависимости
jest.mock('../BookService');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

const mockNavigate = jest.fn();
// Мокаем хуки react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
}));

const mockBook = {
  id: '1',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  description: 'A novel about the American dream.',
  publicationDate: '1925-04-10T00:00:00.000Z',
  isbn: '9780743273565',
  genre: 'Classic',
  availableCopies: 3,
  totalCopies: 5,
};

describe('BookDetails Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.getBookById.mockResolvedValue({ data: { ...mockBook } });
    BookService.deleteBook.mockResolvedValue({});
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/books/1']}>
        <Routes>
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/books" element={<div>Book List Page</div>} />
        </Routes>
      </MemoryRouter>
    );

  const openDeleteModal = async () => {
    await screen.findByRole('heading', { name: mockBook.title });
    const deleteButtonPage = screen.getByRole('button', { name: /Delete/i });
    await user.click(deleteButtonPage);
    const modal = await screen.findByRole('dialog');
    expect(screen.getByRole('heading', { name: /Delete Book/i, container: modal })).toBeInTheDocument();
    return modal;
  };

  test('fetches and displays book details on mount', async () => {
    renderComponent();
    expect(screen.getByText(/Loading book details.../i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: mockBook.title })).toBeInTheDocument();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
    expect(screen.getByText(mockBook.description)).toBeInTheDocument();
    expect(screen.getByText(mockBook.genre)).toBeInTheDocument();
    expect(screen.getByText(mockBook.isbn)).toBeInTheDocument();
    expect(screen.getByText(new Date(mockBook.publicationDate).toLocaleDateString())).toBeInTheDocument();
    expect(screen.getByText(`${mockBook.availableCopies} / ${mockBook.totalCopies}`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Books/i })).toHaveAttribute('href', '/books');
    expect(screen.getByRole('link', { name: /Edit/i })).toHaveAttribute('href', `/books/edit/${mockBook.id}`);
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    expect(BookService.getBookById).toHaveBeenCalledWith('1');
  });

  test('displays error message if fetching fails', async () => {
    const error = new Error('Failed to fetch');
    BookService.getBookById.mockRejectedValue(error);
    renderComponent();
    expect(await screen.findByText(/Failed to load book details. The book might not exist or has been removed./i)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Failed to load book details');
    expect(screen.queryByText(mockBook.title)).not.toBeInTheDocument();
  });

  test('displays "Book not found" if API returns null data', async () => {
    BookService.getBookById.mockResolvedValue({ data: null });
    renderComponent();
    expect(await screen.findByText(/Book not found/i)).toBeInTheDocument();
  });

  test('opens delete confirmation modal when Delete button is clicked', async () => {
    renderComponent();
    const modal = await openDeleteModal();
    expect(screen.getByText(`Are you sure you want to delete the book "`)).toBeInTheDocument();
    expect(screen.getByText(mockBook.title, { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel', container: modal })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i, container: modal })).toBeInTheDocument();
  });

  test('closes delete modal when Cancel button in modal is clicked', async () => {
    renderComponent();
    const modal = await openDeleteModal();
    const modalCancelButton = screen.getByRole('button', { name: /Cancel/i, container: modal });
    await user.click(modalCancelButton);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('calls deleteBook service and navigates on confirm delete in modal', async () => {
    renderComponent();
    const modal = await openDeleteModal();
    const modalDeleteButton = screen.getByRole('button', { name: /Delete/i, container: modal });
    await user.click(modalDeleteButton);

    await waitFor(() => expect(BookService.deleteBook).toHaveBeenCalledWith(mockBook.id));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Book deleted successfully'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/books'));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  test('shows specific API error toast if deleteBook fails from modal', async () => {
    const deleteError = { response: { data: { message: 'Cannot delete this specific book' } } };
    BookService.deleteBook.mockRejectedValue(deleteError);
    renderComponent();
    const modal = await openDeleteModal();
    const modalDeleteButton = screen.getByRole('button', { name: /Delete/i, container: modal });
    await user.click(modalDeleteButton);

    await waitFor(() => expect(BookService.deleteBook).toHaveBeenCalledWith(mockBook.id));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Cannot delete this specific book'));
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('shows generic error toast if deleteBook fails without specific message from modal', async () => {
    const genericError = new Error('Network failed');
    BookService.deleteBook.mockRejectedValue(genericError);
    renderComponent();
    const modal = await openDeleteModal();
    const modalDeleteButton = screen.getByRole('button', { name: /Delete/i, container: modal });
    await user.click(modalDeleteButton);

    await waitFor(() => expect(BookService.deleteBook).toHaveBeenCalledWith(mockBook.id));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to delete book'));
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});