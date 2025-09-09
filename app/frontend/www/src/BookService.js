import axios from 'axios';

// �������������� ��� ������ �������������� ���������
// const USE_MOCK_DATA = false;

// URL ???????
const API_URL = 'http://89.208.104.134:8081/api/books';

// ???????? ??????? API
const realGetAllBooks = () => axios.get(API_URL);
const realGetBookById = (id) => axios.get(`${API_URL}/${id}`);
const realCreateBook = (book) => axios.post(API_URL, book);
const realUpdateBook = (id, book) => axios.put(`${API_URL}/${id}`, book);
const realDeleteBook = (id) => axios.delete(`${API_URL}/${id}`);
const realSearchBooks = (query) => axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);

// ???????????? ??????
const BookService = {
  getAllBooks: realGetAllBooks, // ����� ������ ��������� �������
  getBookById: realGetBookById,
  createBook: realCreateBook,
  updateBook: realUpdateBook,
  deleteBook: realDeleteBook,
  searchBooks: realSearchBooks,
};

export default BookService;