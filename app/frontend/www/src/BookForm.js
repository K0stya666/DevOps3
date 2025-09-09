import React from 'react';

const BookForm = ({ book, onChange, onSubmit, loading, actionText, cancelAction }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title" className="form-label">Title <span className="required">*</span></label>
        <input
          type="text"
          id="title" // Added id
          name="title"
          className="form-control"
          value={book.title || ''} // Ensure value is controlled
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="author" className="form-label">Author <span className="required">*</span></label>
        <input
          type="text"
          id="author" // Added id
          name="author"
          className="form-control"
          value={book.author || ''} // Ensure value is controlled
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description" // Added id
          name="description"
          className="form-control"
          value={book.description || ''} // Ensure value is controlled
          onChange={onChange}
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="publicationDate" className="form-label">Publication Date</label>
          <input
            type="date"
            id="publicationDate" // Added id
            name="publicationDate"
            className="form-control"
            value={book.publicationDate || ''} // Ensure value is controlled
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="isbn" className="form-label">ISBN</label>
          <input
            type="text"
            id="isbn" // Added id
            name="isbn"
            className="form-control"
            value={book.isbn || ''} // Ensure value is controlled
            onChange={onChange}
            placeholder="e.g., 9780123456789"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="genre" className="form-label">Genre</label>
        <input
          type="text"
          id="genre" // Added id
          name="genre"
          className="form-control"
          value={book.genre || ''} // Ensure value is controlled
          onChange={onChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="availableCopies" className="form-label">Available Copies</label>
          <input
            type="number"
            id="availableCopies" // Added id
            name="availableCopies"
            className="form-control"
            value={book.availableCopies || 0} // Ensure value is controlled number
            onChange={onChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="totalCopies" className="form-label">Total Copies</label>
          <input
            type="number"
            id="totalCopies" // Added id
            name="totalCopies"
            className="form-control"
            value={book.totalCopies || 1} // Ensure value is controlled number
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