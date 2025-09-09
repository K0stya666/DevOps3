import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AddBook from '../AddBook';
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

// Мокаем useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


describe('AddBook Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.createBook.mockResolvedValue({ data: { id: '123', title: 'New Book' } });
  });

  const fillValidForm = async () => {
    await user.type(screen.getByLabelText(/Title/i), 'Effective Java');
    await user.type(screen.getByLabelText(/Author/i), 'Joshua Bloch');
    await user.type(screen.getByLabelText(/Description/i), 'A great Java book.');
    fireEvent.change(screen.getByLabelText(/Publication Date/i), { target: { value: '2018-01-06' } });
    await user.type(screen.getByLabelText(/ISBN/i), '9780134685991');
    await user.type(screen.getByLabelText(/Genre/i), 'Programming');
    const availableCopiesInput = screen.getByLabelText(/Available Copies/i);
    const totalCopiesInput = screen.getByLabelText(/Total Copies/i);
    await user.clear(availableCopiesInput);
    await user.type(availableCopiesInput, '5');
    await user.clear(totalCopiesInput);
    await user.type(totalCopiesInput, '10');
  };

  test('renders AddBook form correctly', () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Add New Book/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Author/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Book/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  test('allows input changes', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText(/Title/i);
    const authorInput = screen.getByLabelText(/Author/i);

    await user.type(titleInput, 'Test Title');
    await user.type(authorInput, 'Test Author');

    expect(titleInput).toHaveValue('Test Title');
    expect(authorInput).toHaveValue('Test Author');
  });

  test('shows error toast if title is empty on submit', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Add Book/i }));

    expect(toast.error).toHaveBeenCalledWith('Title is required');
    expect(BookService.createBook).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows error toast if author is empty on submit', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Title/i), 'A Title');
    await user.click(screen.getByRole('button', { name: /Add Book/i }));

    expect(toast.error).toHaveBeenCalledWith('Author is required');
    expect(BookService.createBook).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows error toast if ISBN is invalid (too short)', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Title/i), 'A Title');
    await user.type(screen.getByLabelText(/Author/i), 'An Author');
    await user.type(screen.getByLabelText(/ISBN/i), '123'); // Invalid ISBN
    await user.click(screen.getByRole('button', { name: /Add Book/i }));

    expect(toast.error).toHaveBeenCalledWith('ISBN must be 10 or 13 characters long');
    expect(BookService.createBook).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

   test('shows error toast if ISBN is invalid (too long)', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Title/i), 'A Title');
    await user.type(screen.getByLabelText(/Author/i), 'An Author');
    await user.type(screen.getByLabelText(/ISBN/i), '12345678901234'); // Invalid ISBN
    await user.click(screen.getByRole('button', { name: /Add Book/i }));

    expect(toast.error).toHaveBeenCalledWith('ISBN must be 10 or 13 characters long');
    expect(BookService.createBook).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });


  test('shows error toast if available copies exceed total copies', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Title/i), 'A Title');
    await user.type(screen.getByLabelText(/Author/i), 'An Author');
    const availableCopiesInput = screen.getByLabelText(/Available Copies/i);
    const totalCopiesInput = screen.getByLabelText(/Total Copies/i);

    await user.clear(availableCopiesInput);
    await user.type(availableCopiesInput, '5');
    await user.clear(totalCopiesInput);
    await user.type(totalCopiesInput, '3'); // Available > Total

    await user.click(screen.getByRole('button', { name: /Add Book/i }));

    expect(toast.error).toHaveBeenCalledWith('Available copies cannot exceed total copies');
    expect(BookService.createBook).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('calls BookService.createBook and navigates on successful submit', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );
    await fillValidForm(); // Заполняем форму валидными данными
    const submitButton = screen.getByRole('button', { name: /Add Book/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(BookService.createBook).toHaveBeenCalledTimes(1);
      expect(BookService.createBook).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Effective Java',
        author: 'Joshua Bloch',
        availableCopies: 5,
        totalCopies: 10,
      }));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Book added successfully!');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/books');
    });
  });

  test('shows specific API error toast if createBook fails with response data', async () => {
    const apiError = { response: { data: { message: 'Unique ISBN constraint violated' } } };
    BookService.createBook.mockRejectedValue(apiError);

    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );
    await fillValidForm(); // Заполняем форму валидными данными
    await user.click(screen.getByRole('button', { name: /Add Book/i }));

    await waitFor(() => {
      expect(BookService.createBook).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      // Должен показать ошибку из API
      expect(toast.error).toHaveBeenCalledWith('Unique ISBN constraint violated');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  test('shows generic error toast if createBook fails without specific message', async () => {
    const genericError = new Error('Network Error'); // Ошибка без response.data.message
    BookService.createBook.mockRejectedValue(genericError);

    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );
    await fillValidForm(); // Заполняем форму валидными данными
    await user.click(screen.getByRole('button', { name: /Add Book/i }));

    await waitFor(() => {
      expect(BookService.createBook).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
       // Должен показать ошибку по умолчанию
      expect(toast.error).toHaveBeenCalledWith('Failed to add book');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
     expect(toast.success).not.toHaveBeenCalled();
  });


  test('calls navigate back when Cancel button is clicked', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/books');
  });
});