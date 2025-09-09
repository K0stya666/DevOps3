import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookList from '../BookList';
import BookService from '../BookService';
import { toast } from 'react-toastify';

jest.mock('../BookService');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container"/>,
}));

const mockBooks = [
  {
    id: '1',
    title: 'Book One List',
    author: 'Author One',
    description: 'Description for book one.',
    genre: 'Fiction',
    availableCopies: 2,
    totalCopies: 3,
  },
  {
    id: '2',
    title: 'Book Two List',
    author: 'Author Two',
    description: 'Description for book two, long.',
    genre: 'Non-Fiction',
    availableCopies: 1,
    totalCopies: 1,
  },
];

describe('BookList Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
        BookService.getAllBooks.mockResolvedValue({ data: [...mockBooks] });
        BookService.deleteBook.mockResolvedValue({ data: { message: 'Book deleted successfully' } });
    });

    const renderComponent = () => {
        let rendered;
        act(() => {
            rendered = render(
                <MemoryRouter>
                    <BookList />
                </MemoryRouter>
            );
        });
        return rendered;
    };

    const openDeleteModalForBook = async (bookTitle) => {
        await screen.findByText(bookTitle);
        const card = screen.getByText(bookTitle).closest('.book-card');
        const deleteButton = card.querySelector('button.btn-danger');
        await act(async () => {
            await user.click(deleteButton);
        });
        const modal = await screen.findByRole('dialog');
        expect(screen.getByRole('heading', { name: /Delete Book/i, container: modal })).toBeInTheDocument();
        return modal;
    };

    test('fetches and displays list of books', async () => {
        renderComponent();
        expect(screen.getByText(/Loading books.../i)).toBeInTheDocument();
        expect(await screen.findByRole('heading', { name: /Book Library/i })).toBeInTheDocument();
        expect(screen.getByText(`Total Books: ${mockBooks.length}`)).toBeInTheDocument();

        for (const book of mockBooks) {
            expect(screen.getByText(book.title)).toBeInTheDocument();
            expect(screen.getByText(`by ${book.author}`)).toBeInTheDocument();
        }
        expect(BookService.getAllBooks).toHaveBeenCalledTimes(1);
    });

    test('displays message when no books are found', async () => {
        BookService.getAllBooks.mockResolvedValue({ data: [] });
        renderComponent();
        expect(await screen.findByText(/No books found/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Add a new book/i })).toHaveAttribute('href', '/books/add');
    });

    test('displays error message if fetching fails', async () => {
        const error = new Error('Network Error');
        BookService.getAllBooks.mockRejectedValue(error);
        renderComponent();
        expect(await screen.findByText(/Failed to load books/i)).toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith('Failed to load books');
    });

    test('opens delete confirmation modal when delete button on a card is clicked', async () => {
        renderComponent();
        const modal = await openDeleteModalForBook(mockBooks[0].title);
        expect(screen.getByText(mockBooks[0].title, { exact: false })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel', container: modal })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Delete/i, container: modal })).toBeInTheDocument();
    });

    test('closes delete modal when Cancel button in modal is clicked', async () => {
        renderComponent();
        const modal = await openDeleteModalForBook(mockBooks[0].title);
        const modalCancelButton = screen.getByRole('button', { name: /Cancel/i, container: modal });
        await act(async () => {
            await user.click(modalCancelButton);
        });
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    test('removes book from list after successful deletion via modal', async () => {
        renderComponent();
        const modal = await openDeleteModalForBook(mockBooks[0].title);
        const confirmButton = screen.getByRole('button', { name: /Delete/i, container: modal });
        await act(async () => {
            await user.click(confirmButton);
        });

        await waitFor(() => expect(BookService.deleteBook).toHaveBeenCalledWith(mockBooks[0].id));
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Book deleted successfully'));
        await waitFor(() => expect(screen.queryByText(mockBooks[0].title)).not.toBeInTheDocument());

        expect(screen.getByText(mockBooks[1].title)).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockBooks.length - 1);
        expect(screen.getByText(`Total Books: ${mockBooks.length - 1}`)).toBeInTheDocument();
    });

    test('shows error toast when deletion fails from modal', async () => {
        const deleteError = { response: { data: { message: 'Failed to delete from list' } } };
        BookService.deleteBook.mockRejectedValue(deleteError);
        renderComponent();
        const modal = await openDeleteModalForBook(mockBooks[0].title);
        const confirmButton = screen.getByRole('button', { name: /Delete/i, container: modal });
        await act(async () => {
            await user.click(confirmButton);
        });

        await waitFor(() => expect(BookService.deleteBook).toHaveBeenCalledWith(mockBooks[0].id));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to delete from list'));

        expect(screen.getByText(mockBooks[0].title)).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockBooks.length);
    });
});