import axios from 'axios';

const API_URL = '/api/books';

const BookService = {
  getAllBooks: () => axios.get(API_URL),
  getBookById: (id) => axios.get(`${API_URL}/${id}`),
  createBook: (book) => axios.post(API_URL, book),
  updateBook: (id, book) => axios.put(`${API_URL}/${id}`, book),
  deleteBook: (id) => axios.delete(`${API_URL}/${id}`),
  searchBooks: (query) => axios.get(`${API_URL}/search?query=${query}`),
};

export default BookService;
