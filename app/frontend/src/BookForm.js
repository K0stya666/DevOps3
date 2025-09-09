import React from 'react';

const BookForm = ({ book, onChange, onSubmit, loading, actionText, cancelAction }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label">Title <span className="required">*</span></label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={book.title}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Author <span className="required">*</span></label>
        <input
          type="text"
          name="author"
          className="form-control"
          value={book.author}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          value={book.description}
          onChange={onChange}
          rows="4"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Publication Date</label>
          <input
            type="date"
            name="publicationDate"
            className="form-control"
            value={book.publicationDate}
            onChange={onChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            name="isbn"
            className="form-control"
            value={book.isbn}
            onChange={onChange}
            placeholder="e.g., 9780123456789"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Genre</label>
        <input
          type="text"
          name="genre"
          className="form-control"
          value={book.genre}
          onChange={onChange}
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Available Copies</label>
          <input
            type="number"
            name="availableCopies"
            className="form-control"
            value={book.availableCopies}
            onChange={onChange}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Total Copies</label>
          <input
            type="number"
            name="totalCopies"
            className="form-control"
            value={book.totalCopies}
            onChange={onChange}
            min="1"
          />
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : actionText}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={cancelAction}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BookForm;