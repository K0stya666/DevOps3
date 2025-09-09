import React, { useState, useEffect, useCallback } from 'react'; // ����������� useCallback
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookService from './BookService';

// ��������� ���������� ���� ��� �������� �����
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
    // ��������� role="dialog" � aria-modal ��� �����������
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

  // ����������� fetchBook � useCallback, ����� ������ �� ������� �� ��������
  // ��� ������ �������, ���� ������ `id` �� ���������.
  const fetchBook = useCallback(() => {
    setLoading(true); // ������ ������ ����� ��������
    setError(null);   // ���������� ������
    BookService.getBookById(id)
      .then(response => {
        // ���������, ��� ������ �� null ����� ����������
        if (response.data) {
            setBook(response.data);
        } else {
            // ���� API ������ null, ������� ��� ������� "�� �������"
             setError('Book not found');
             setBook(null); // ��������, ��� book �������
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching book details:', error);
        setError('Failed to load book details. The book might not exist or has been removed.');
        setLoading(false);
        setBook(null); // ���������� ����� ��� ������
        toast.error('Failed to load book details');
      });
  }, [id]); // ����������� fetchBook - ������ id

  useEffect(() => {
    fetchBook();
    // ��������� fetchBook � ������ ������������ useEffect
  }, [fetchBook]); // ������ ����������� - ���� ������� fetchBook

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

  // ������� ����� �������� �� !book ����� ��������� ������/null ������
  if (!book) {
     // ����� �������� �� �� ��������� �� ������ ��� ����������� "Book not found"
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
            <p><strong>Available Copies:</strong> {book.availableCopies ?? 0} / {book.totalCopies ?? 0}</p> {/* ���������� ?? ��� null/undefined */}
          </div>
        </div>

        <div className="actions-container">
          <Link to="/books" className="btn btn-secondary">Back to Books</Link>
          <Link to={`/books/edit/${book.id}`} className="btn btn-primary">Edit</Link>
          <button onClick={handleDeleteClick} className="btn btn-danger">Delete</button>
        </div>
      </div>

      {/* ��������� ���� �������� */}
      <DeleteBookModal
        book={book}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={() => navigate('/books')} // ��������� ����� ��������� ��������
      />
    </div>
  );
};

export default BookDetails;