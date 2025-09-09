import React, { useState } from 'react';
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

const SearchBooks = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setSearched(true);
    
    BookService.searchBooks(query)
      .then(response => {
        setSearchResults(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error searching books:', error);
        toast.error('Error searching books');
        setLoading(false);
        setSearchResults([]);
      });
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  return (
    <div>
      <h2>Search Books</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, author, or ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {loading && <div className="loading">Searching books...</div>}
      
      {searched && !loading && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          {searchResults.length === 0 ? (
            <p>No books found matching your search criteria.</p>
          ) : (
            <div className="book-list">
              {searchResults.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-content">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <div className="book-details">
                      <p><strong>Genre:</strong> {book.genre || 'Not specified'}</p>
                      <p><strong>ISBN:</strong> {book.isbn || 'Not specified'}</p>
                    </div>
                    <div className="book-actions">
                      <Link to={`/books/${book.id}`} className="btn btn-secondary">View</Link>
                      <Link to={`/books/edit/${book.id}`} className="btn btn-primary">Edit</Link>
                      <button onClick={() => handleDeleteClick(book)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Модальное окно удаления */}
      <DeleteBookModal 
        book={bookToDelete}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={() => {
          setSearchResults(searchResults.filter(book => book.id !== bookToDelete?.id));
        }}
      />
    </div>
  );
};

export default SearchBooks;