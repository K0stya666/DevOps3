import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, onDelete }) => {
  return (
    <div className="book-card">
      <div className="book-cover">
        <div className="book-cover-icon">{book.title.charAt(0)}</div>
      </div>
      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <p className="book-description">
          {book.description ? 
            (book.description.length > 100 ? book.description.substring(0, 100) + '...' : book.description) 
            : 'No description available'}
        </p>
        <div className="book-meta">
          <span className="book-genre">{book.genre || 'Not specified'}</span>
          <span className="book-copies">
            {book.availableCopies || 0}/{book.totalCopies || 0} available
          </span>
        </div>
        <div className="book-actions">
          <Link to={`/books/${book.id}`} className="btn btn-secondary">View</Link>
          <Link to={`/books/edit/${book.id}`} className="btn btn-primary">Edit</Link>
          <button onClick={() => onDelete(book.id)} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;