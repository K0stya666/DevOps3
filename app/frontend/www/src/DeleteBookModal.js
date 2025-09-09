import React from 'react';
import { toast } from 'react-toastify';
import BookService from './BookService';

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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Delete Book</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body delete-modal-body">
          <div className="delete-modal-icon">⚠️</div>
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

export default DeleteBookModal;