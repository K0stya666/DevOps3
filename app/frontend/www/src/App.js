import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components

import Header from './Header';
import Footer from './Footer';
import BookList from './BookList';
import AddBook from './AddBook';
import EditBook from './EditBook';
import BookDetails from './BookDetails';
import SearchBooks from './SearchBooks';
import NotFound from './NotFound';

const App = () => {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/edit/:id" element={<EditBook />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/search" element={<SearchBooks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;