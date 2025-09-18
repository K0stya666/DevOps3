import React from 'react';

const BookForm = ({ book, onChange, onSubmit, loading, actionText, cancelAction }) => {
    return (
        <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
                <label className="form-label" htmlFor="title">Title <span className="required">*</span></label>
                <input
                    id="title"
                    name="title"
                    className="form-control"
                    type="text"
                    required
                    value={book.title}
                    onChange={onChange}
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="author">Author <span className="required">*</span></label>
                <input
                    id="author"
                    name="author"
                    className="form-control"
                    type="text"
                    required
                    value={book.author}
                    onChange={onChange}
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="4"
                    value={book.description}
                    onChange={onChange}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label" htmlFor="publicationDate">Publication Date</label>
                    <input
                        id="publicationDate"
                        name="publicationDate"
                        className="form-control"
                        type="date"
                        value={book.publicationDate}
                        onChange={onChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="isbn">ISBN</label>
                    <input
                        id="isbn"
                        name="isbn"
                        className="form-control"
                        type="text"
                        placeholder="e.g., 9780123456789"
                        value={book.isbn}
                        onChange={onChange}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="genre">Genre</label>
                <input
                    id="genre"
                    name="genre"
                    className="form-control"
                    type="text"
                    value={book.genre}
                    onChange={onChange}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label" htmlFor="availableCopies">Available Copies</label>
                    <input
                        id="availableCopies"
                        name="availableCopies"
                        className="form-control"
                        type="number"
                        min="0"
                        value={book.availableCopies}
                        onChange={onChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="totalCopies">Total Copies</label>
                    <input
                        id="totalCopies"
                        name="totalCopies"
                        className="form-control"
                        type="number"
                        min="1"
                        value={book.totalCopies}
                        onChange={onChange}
                    />
                </div>
            </div>

            <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (actionText || 'Save')}
                </button>
                <button className="btn btn-secondary" type="button" onClick={cancelAction} disabled={loading}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default BookForm;
