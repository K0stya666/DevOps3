import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookForm from '../BookForm';

describe('BookForm Component', () => {
  const mockBook = {
    title: 'Initial Title',
    author: 'Initial Author',
    description: 'Initial Description',
    publicationDate: '2022-01-01',
    isbn: '1234567890',
    genre: 'Initial Genre',
    availableCopies: 5,
    totalCopies: 10,
  };

  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn((e) => e.preventDefault());
  const mockCancelAction = jest.fn();

  const defaultProps = {
    book: mockBook,
    onChange: mockOnChange,
    onSubmit: mockOnSubmit,
    loading: false,
    actionText: 'Submit Action',
    cancelAction: mockCancelAction,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnSubmit.mockClear();
    mockCancelAction.mockClear();
  });

  test('renders all form fields with initial values', () => {
    render(<BookForm {...defaultProps} />);

    // Используем getByLabelText там, где это надежно (связь label/input есть)
    expect(screen.getByLabelText(/Title/i)).toHaveValue(mockBook.title);
    expect(screen.getByLabelText(/Author/i)).toHaveValue(mockBook.author);
    expect(screen.getByLabelText(/Description/i)).toHaveValue(mockBook.description);
    expect(screen.getByLabelText(/Publication Date/i)).toHaveValue(mockBook.publicationDate);
    expect(screen.getByLabelText(/ISBN/i)).toHaveValue(mockBook.isbn);
    expect(screen.getByLabelText(/Genre/i)).toHaveValue(mockBook.genre);
    expect(screen.getByLabelText(/Available Copies/i)).toHaveValue(mockBook.availableCopies);
    expect(screen.getByLabelText(/Total Copies/i)).toHaveValue(mockBook.totalCopies);

    expect(screen.getByRole('button', { name: defaultProps.actionText })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  test('calls onChange handler when input value changes', async () => {
    const user = userEvent.setup();
    render(<BookForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const newTitle = 'New Book Title';

    await user.clear(titleInput);
    await user.type(titleInput, newTitle);

    expect(mockOnChange).toHaveBeenCalled();
    const lastCallTitle = mockOnChange.mock.calls.find(call => call[0].target.name === 'title');
    expect(lastCallTitle[0].target.value).toBe(newTitle);


    const availableCopiesInput = screen.getByLabelText(/Available Copies/i);
    await user.clear(availableCopiesInput);
    await user.type(availableCopiesInput, '8');
    const lastCallCopies = mockOnChange.mock.calls.find(call => call[0].target.name === 'availableCopies');
    // Input type number value is string in the event target
    expect(lastCallCopies[0].target.value).toBe('8');


    const descriptionInput = screen.getByLabelText(/Description/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'New desc');
    const lastCallDesc = mockOnChange.mock.calls.find(call => call[0].target.name === 'description');
    expect(lastCallDesc[0].target.value).toBe('New desc');
  });

  test('calls onSubmit handler when form is submitted', async () => {
    const user = userEvent.setup();
    render(<BookForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: defaultProps.actionText });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test('calls cancelAction handler when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<BookForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockCancelAction).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('disables buttons and shows loading text when loading is true', () => {
    render(<BookForm {...defaultProps} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /Processing.../i });
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  test('shows correct actionText on submit button when not loading', () => {
    render(<BookForm {...defaultProps} loading={false} actionText="Update Book" />);

    const submitButton = screen.getByRole('button', { name: /Update Book/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
    expect(screen.queryByText(/Processing.../i)).not.toBeInTheDocument();
  });

  test('renders required indicators for title and author', () => {
    render(<BookForm {...defaultProps} />);

    // Находим label по тексту и проверяем наличие span.required внутри него
    const titleLabel = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'label' && element.getAttribute('for') === 'title';
    });
     const authorLabel = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'label' && element.getAttribute('for') === 'author';
    });
     const descriptionLabel = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'label' && element.getAttribute('for') === 'description';
    });

    // eslint-disable-next-line testing-library/no-node-access
    expect(titleLabel.querySelector('span.required')).toBeInTheDocument();
     // eslint-disable-next-line testing-library/no-node-access
    expect(titleLabel.querySelector('span.required')).toHaveTextContent('*');

    // eslint-disable-next-line testing-library/no-node-access
    expect(authorLabel.querySelector('span.required')).toBeInTheDocument();
     // eslint-disable-next-line testing-library/no-node-access
    expect(authorLabel.querySelector('span.required')).toHaveTextContent('*');

    // eslint-disable-next-line testing-library/no-node-access
    expect(descriptionLabel.querySelector('span.required')).not.toBeInTheDocument();
  });
});