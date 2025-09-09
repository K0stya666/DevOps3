import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchBooks from '../SearchBooks';
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

// Мокаем модалку удаления
jest.mock('../DeleteBookModal', () => {
  // eslint-disable-next-line react/display-name
  return ({ book, isOpen, onClose, onSuccess }) => {
    if (!isOpen || !book) return null;
    return (
      <div role="dialog" aria-modal="true" data-testid="delete-modal">
        <h3>Delete Mock Modal for {book?.title}</h3>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onSuccess}>Delete</button>
      </div>
    );
  };
});

const mockSearchResults = [
  { id: 's1', title: 'Search Result One', author: 'Search Author 1', genre: 'Search Genre 1', isbn: '1111111111' },
  { id: 's2', title: 'Result Two', author: 'Search Author 2', genre: 'Search Genre 2', isbn: '2222222222' },
];

describe('SearchBooks Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.searchBooks.mockResolvedValue({ data: [...mockSearchResults] });
    BookService.deleteBook.mockResolvedValue({});
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

  const performSearch = async (term = 'Result') => {
    const searchInput = screen.getByPlaceholderText(/Search by title, author, or ISBN/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    if (term) {
      await user.type(searchInput, term);
    }
    await user.click(searchButton);
  };

  const findCardDeleteButton = (title) => {
    const card = screen.getByText(title).closest('.book-card');
    return card.querySelector('button.btn-danger');
  };

  test('renders search form', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /Search Books/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by title, author, or ISBN/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Search Results/i })).not.toBeInTheDocument();
  });

  test('shows error toast if search term is empty', async () => {
    renderComponent();
    await performSearch('');
    expect(toast.error).toHaveBeenCalledWith('Please enter a search term');
    expect(BookService.searchBooks).not.toHaveBeenCalled();
  });

  test('calls search service and displays results on submit', async () => {
    renderComponent();
    await performSearch('Result');

    expect(screen.getByText(/Searching books.../i)).toBeInTheDocument();

    await waitFor(() => expect(BookService.searchBooks).toHaveBeenCalledWith('Result'));

    expect(await screen.findByRole('heading', { name: /Search Results \(2\)/i })).toBeInTheDocument();
    expect(screen.getByText(mockSearchResults[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockSearchResults[1].title)).toBeInTheDocument();

    const card1 = screen.getByText(mockSearchResults[0].title).closest('.book-card');
    expect(card1).not.toBeNull();
    expect(card1.querySelector('.book-details')).toHaveTextContent(`Genre: ${mockSearchResults[0].genre}`);
    expect(card1.querySelector('.book-details')).toHaveTextContent(`ISBN: ${mockSearchResults[0].isbn}`);
    expect(card1.querySelector(`a[href="/books/s1"]`)).toBeInTheDocument();
    expect(card1.querySelector(`a[href="/books/edit/s1"]`)).toBeInTheDocument();
    expect(card1.querySelector('button.btn-danger')).toBeInTheDocument();
  });

  test('displays message when no results are found', async () => {
    BookService.searchBooks.mockResolvedValue({ data: [] });
    renderComponent();
    await performSearch('nonexistent');

    await waitFor(() => expect(BookService.searchBooks).toHaveBeenCalledWith('nonexistent'));
    expect(await screen.findByRole('heading', { name: /Search Results \(0\)/i })).toBeInTheDocument();
    expect(screen.getByText(/No books found matching your search criteria./i)).toBeInTheDocument();
  });

  test('displays error toast if search fails', async () => {
    const error = new Error('Search API failed');
    BookService.searchBooks.mockRejectedValue(error);
    renderComponent();
    await performSearch('query');

    await waitFor(() => expect(BookService.searchBooks).toHaveBeenCalledWith('query'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Error searching books'));
    expect(screen.queryByRole('heading', { name: /Search Results/i })).not.toBeInTheDocument();
  });

  test('opens delete modal when delete button on a search result is clicked', async () => {
    renderComponent();
    await performSearch();
    const deleteButton1 = findCardDeleteButton(mockSearchResults[0].title);
    await user.click(deleteButton1);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(`Delete Mock Modal for ${mockSearchResults[0].title}`)).toBeInTheDocument();
  });

  test('removes item from results list after successful deletion via modal', async () => {
    renderComponent();
    await performSearch();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockSearchResults.length);

    const deleteButton1 = findCardDeleteButton(mockSearchResults[0].title);
    await user.click(deleteButton1);

    const modal = await screen.findByRole('dialog');
    const confirmButton = screen.getByRole('button', { name: /Delete/i, container: modal });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText(mockSearchResults[0].title)).not.toBeInTheDocument();
    });

    expect(screen.getByText(mockSearchResults[1].title)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockSearchResults.length - 1);
    expect(screen.getByRole('heading', { name: /Search Results \(1\)/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('closes delete modal when Cancel is clicked in modal', async () => {
    renderComponent();
    await performSearch();
    const deleteButton1 = findCardDeleteButton(mockSearchResults[0].title);
    await user.click(deleteButton1);

    const modal = await screen.findByRole('dialog');
    const cancelButton = screen.getByRole('button', { name: /Cancel/i, container: modal });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(screen.getByText(mockSearchResults[0].title)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockSearchResults.length);
  });
});