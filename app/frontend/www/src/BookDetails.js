import React, { useState, useEffect, useCallback } from 'react'; // Импортируем useCallback
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookService from './BookService';

// Компонент модального окна для удаления книги
const DeleteBookModal = ({ book, isOpen, onClose, onSuccess }) => {
  if (!isOpen || !book) return null;

  const handleDelete = () => {
    BookService.deleteBook(book.id)
      .then(() => {
        toast.success('Book deleted successfully');
        onSuccess();
        onClose();
      })
      .catch(error => {
        console.error('Error deleting book:', error);
        toast.error(error.response?.data?.message || 'Failed to delete book');
        // Consider calling onClose() here as well, even on error,
        // depending on desired UX. For now, keeping original behavior.
      });
  };

  return (
    // Добавляем role="dialog" и aria-modal для доступности
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="delete-modal-title" className="modal-title">Delete Book</h3>
          <button className="modal-close" onClick={onClose}>?</button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to delete the book "<strong>{book.title}</strong>"?</p>
          <p>This action cannot be undone.</p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Оборачиваем fetchBook в useCallback, чтобы ссылка на функцию не менялась
  // при каждом рендере, если только `id` не изменился.
  const fetchBook = useCallback(() => {
    setLoading(true); // Ставим лоадер перед запросом
    setError(null);   // Сбрасываем ошибку
    BookService.getBookById(id)
      .then(response => {
        // Проверяем, что данные не null перед установкой
        if (response.data) {
            setBook(response.data);
        } else {
            // Если API вернул null, считаем это ошибкой "не найдено"
             setError('Book not found');
             setBook(null); // Убедимся, что book сброшен
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching book details:', error);
        setError('Failed to load book details. The book might not exist or has been removed.');
        setLoading(false);
        setBook(null); // Сбрасываем книгу при ошибке
        toast.error('Failed to load book details');
      });
  }, [id]); // Зависимость fetchBook - только id

  useEffect(() => {
    fetchBook();
    // Добавляем fetchBook в массив зависимостей useEffect
  }, [fetchBook]); // Теперь зависимость - сама функция fetchBook

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <div style={{ marginTop: '20px' }}>
          <Link to="/books" className="btn btn-primary">Back to Books</Link>
        </div>
      </div>
    );
  }

  // Добавим явную проверку на !book после обработки ошибки/null данных
  if (!book) {
     // Можно показать то же сообщение об ошибке или специфичное "Book not found"
    return <div className="error">Book not found</div>;
  }


  return (
    <div className="book-details-container">
      <h2>Book Details</h2>

      <div className="book-details-card">
        <h3>{book.title}</h3>
        <p><strong>Author:</strong> {book.author}</p>

        <div className="details-section">
          <p><strong>Description:</strong></p>
          <p>{book.description || 'No description available'}</p>
        </div>

        <div className="details-grid">
          <div>
            <p><strong>Genre:</strong> {book.genre || 'Not specified'}</p>
            <p><strong>ISBN:</strong> {book.isbn || 'Not specified'}</p>
          </div>
          <div>
            <p><strong>Publication Date:</strong> {book.publicationDate ? new Date(book.publicationDate).toLocaleDateString() : 'Unknown'}</p>
            <p><strong>Available Copies:</strong> {book.availableCopies ?? 0} / {book.totalCopies ?? 0}</p> {/* Используем ?? для null/undefined */}
          </div>
        </div>

        <div className="actions-container">
          <Link to="/books" className="btn btn-secondary">Back to Books</Link>
          <Link to={`/books/edit/${book.id}`} className="btn btn-primary">Edit</Link>
          <button onClick={handleDeleteClick} className="btn btn-danger">Delete</button>
        </div>
      </div>

      {/* Модальное окно удаления */}
      <DeleteBookModal
        book={book}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={() => navigate('/books')} // Навигация после успешного удаления
      />
    </div>
  );
};

export default BookDetails;