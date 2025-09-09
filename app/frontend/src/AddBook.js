import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookService from './BookService';
import BookForm from './BookForm';

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    publicationDate: '',
    isbn: '',
    genre: '',
    availableCopies: 1,
    totalCopies: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const validateForm = () => {
    if (!book.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!book.author.trim()) {
      toast.error('Author is required');
      return false;
    }
    // ISBN validation
    if (book.isbn && (book.isbn.length < 10 || book.isbn.length > 13)) {
      toast.error('ISBN must be 10 or 13 characters long');
      return false;
    }
    // Copies validation
    if (parseInt(book.availableCopies) > parseInt(book.totalCopies)) {
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
    
    setLoading(true);

    // Convert string values to appropriate types
    const bookData = {
      ...book,
      availableCopies: parseInt(book.availableCopies),
      totalCopies: parseInt(book.totalCopies)
    };
    
    BookService.createBook(bookData)
      .then(response => {
        toast.success('Book added successfully!');
        navigate('/books');
      })
      .catch(error => {
        console.error('Error adding book:', error);
        toast.error(error.response?.data?.message || 'Failed to add book');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="form-container">
      <div className="page-header">
        <h2 className="form-title">Add New Book</h2>
      </div>
      <div className="card">
        <BookForm 
          book={book}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          actionText="Add Book"
          cancelAction={() => navigate('/books')}
        />
      </div>
    </div>
  );
};

export default AddBook;