import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Delete Book</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
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

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    setLoading(true);
    BookService.getAllBooks()
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
        toast.error('Failed to load books');
      });
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Book Library</h2>
      <p>Total Books: {books.length}</p>
      
      <div className="book-list">
        {books.length === 0 ? (
          <div>No books found. <Link to="/books/add">Add a new book</Link></div>
        ) : (
          books.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-content">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-description">
                  {book.description ? 
                    (book.description.length > 100 ? book.description.substring(0, 100) + '...' : book.description) 
                    : 'No description available'}
                </p>
                <div className="book-details">
                  <p><strong>Genre:</strong> {book.genre || 'Not specified'}</p>
                  <p><strong>Available Copies:</strong> {book.availableCopies || 0} / {book.totalCopies || 0}</p>
                </div>
                <div className="book-actions">
                  <Link to={`/books/${book.id}`} className="btn btn-secondary">View</Link>
                  <Link to={`/books/edit/${book.id}`} className="btn btn-primary">Edit</Link>
                  <button onClick={() => handleDeleteClick(book)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Модальное окно удаления */}
      <DeleteBookModal 
        book={bookToDelete}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={() => {
          setBooks(books.filter(book => book.id !== bookToDelete?.id));
        }}
      />
    </div>
  );
};

export default BookList;