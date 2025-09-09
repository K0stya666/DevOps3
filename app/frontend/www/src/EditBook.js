import React, { useState, useEffect, useCallback } from 'react'; // Импортируем useCallback
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookService from './BookService';
import BookForm from './BookForm';
import Loading from './Loading';
import Error from './Error';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    publicationDate: '',
    isbn: '',
    genre: '',
    availableCopies: 0,
    totalCopies: 1 // Минимальное значение для totalCopies
  });

  // Оборачиваем fetchBook в useCallback
  const fetchBook = useCallback(() => {
    setLoading(true);
    setError(null);
    BookService.getBookById(id)
      .then(response => {
        const bookData = response.data;
        // Format date for input field (YYYY-MM-DD) if it exists
        if (bookData?.publicationDate) {
          try {
             const date = new Date(bookData.publicationDate);
             // Проверяем, что дата валидна перед форматированием
             if (!isNaN(date.getTime())) {
                bookData.publicationDate = date.toISOString().split('T')[0];
             } else {
                 bookData.publicationDate = ''; // Устанавливаем пустую строку, если дата невалидна
             }
          } catch (e) {
             console.error("Error formatting date:", e);
             bookData.publicationDate = '';
          }
        } else {
            bookData.publicationDate = ''; // Устанавливаем пустую строку, если даты нет
        }
        // Устанавливаем значения по умолчанию для копий, если они null/undefined
        setBook({
            ...bookData,
            availableCopies: bookData.availableCopies ?? 0,
            totalCopies: bookData.totalCopies ?? 1,
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching book:', error);
        setError('Failed to load book data. The book might not exist or has been removed.');
        setLoading(false);
        toast.error('Failed to load book data');
      });
  }, [id]); // Зависимость useCallback - только id

  useEffect(() => {
    fetchBook();
    // Добавляем fetchBook в массив зависимостей
  }, [fetchBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prevBook => ({ ...prevBook, [name]: value }));
  };

  const validateForm = () => {
    if (!book.title?.trim()) { // Добавим ?. для безопасности
      toast.error('Title is required');
      return false;
    }
    if (!book.author?.trim()) { // Добавим ?. для безопасности
      toast.error('Author is required');
      return false;
    }
    // ISBN validation
    if (book.isbn && (book.isbn.length < 10 || book.isbn.length > 13)) {
      toast.error('ISBN must be 10 or 13 characters long');
      return false;
    }
    // Copies validation
    const available = parseInt(book.availableCopies, 10);
    const total = parseInt(book.totalCopies, 10);
    // Проверяем, что парсинг удался и total > 0 (или >= 1)
    if (isNaN(available) || isNaN(total) || total < 1) {
        toast.error('Total copies must be a number greater than 0.');
        return false;
    }
     if (available < 0) {
        toast.error('Available copies cannot be negative.');
        return false;
    }
    if (available > total) {
      toast.error('Available copies cannot exceed total copies');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    // Преобразуем копии в числа перед отправкой
    const bookDataToUpdate = {
      ...book,
      availableCopies: parseInt(book.availableCopies, 10),
      totalCopies: parseInt(book.totalCopies, 10)
    };

    BookService.updateBook(id, bookDataToUpdate)
      .then(response => {
        toast.success('Book updated successfully!');
        navigate(`/books/${id}`);
      })
      .catch(error => {
        console.error('Error updating book:', error);
        toast.error(error.response?.data?.message || 'Failed to update book');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (loading) {
    return <Loading message="Loading book data..." />;
  }

  if (error) {
    // Используем компонент Error для отображения ошибки
    return <Error message={error} backLink={`/books/${id}`} backText="Back to Details"/>;
  }

  return (
    <div className="form-container">
      <div className="page-header">
        <h2 className="form-title">Edit Book</h2>
      </div>

      <div className="card">
        <BookForm
          book={book}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={saving}
          actionText="Save Changes"
          cancelAction={() => navigate(`/books/${id}`)}
        />
      </div>
    </div>
  );
};

export default EditBook;