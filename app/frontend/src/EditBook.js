import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookService from './BookService';
import BookForm from './BookForm';
import Loading from './Loading';
import Error from './Error';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    publicationDate: '',
    isbn: '',
    genre: '',
    availableCopies: 0,
    totalCopies: 0
  });

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = () => {
    BookService.getBookById(id)
      .then(response => {
        const bookData = response.data;
        // Format date for input field (YYYY-MM-DD)
        if (bookData.publicationDate) {
          const date = new Date(bookData.publicationDate);
          bookData.publicationDate = date.toISOString().split('T')[0];
        }
        setBook(bookData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching book:', error);
        setError('Failed to load book data. The book might not exist or has been removed.');
        setLoading(false);
        toast.error('Failed to load book data');
      });
  };
  
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
    
    setSaving(true);
    
    // Convert string values to appropriate types
    const bookData = {
      ...book,
      availableCopies: parseInt(book.availableCopies),
      totalCopies: parseInt(book.totalCopies)
    };
    BookService.updateBook(id, bookData)
      .then(response => {
        toast.success('Book updated successfully!');
        navigate(`/books/${id}`);
      })
      .catch(error => {
        console.error('Error updating book:', error);
        toast.error(error.response?.data?.message || 'Failed to update book');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (loading) {
    return <Loading message="Loading book data..." />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="form-container">
      <div className="page-header">
        <h2 className="form-title">Edit Book</h2>
      </div>
      
      <div className="card">
        <BookForm 
          book={book}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={saving}
          actionText="Save Changes"
          cancelAction={() => navigate(`/books/${id}`)}
        />
      </div>
    </div>
  );
};

export default EditBook;