import axios from 'axios';
import BookService from '../BookService';

// Мокаем весь модуль axios
jest.mock('axios');

const API_URL = 'http://89.208.104.134:8080/api/books';

describe('BookService', () => {
  afterEach(() => {
    // Сбрасываем все моки после каждого теста
    jest.clearAllMocks();
  });

  test('getAllBooks should call axios.get with the correct URL', async () => {
    const mockData = [{ id: '1', title: 'Book 1' }];
    axios.get.mockResolvedValue({ data: mockData }); // Настраиваем мок ответа

    const response = await BookService.getAllBooks();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(API_URL);
    expect(response.data).toEqual(mockData); // Проверяем, что данные из мока возвращаются
  });

  test('getBookById should call axios.get with the correct URL and ID', async () => {
    const bookId = 'test-id-123';
    const mockData = { id: bookId, title: 'Specific Book' };
    axios.get.mockResolvedValue({ data: mockData });

    const response = await BookService.getBookById(bookId);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${bookId}`);
    expect(response.data).toEqual(mockData);
  });

  test('createBook should call axios.post with the correct URL and book data', async () => {
    const newBook = { title: 'New Test Book', author: 'Test Author' };
    const mockResponseData = { id: 'new-id', ...newBook };
    axios.post.mockResolvedValue({ data: mockResponseData });

    const response = await BookService.createBook(newBook);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(API_URL, newBook);
    expect(response.data).toEqual(mockResponseData);
  });

  test('updateBook should call axios.put with the correct URL, ID, and book data', async () => {
    const bookId = 'update-id-456';
    const updatedBook = { title: 'Updated Title', author: 'Updated Author' };
    const mockResponseData = { id: bookId, ...updatedBook };
    axios.put.mockResolvedValue({ data: mockResponseData });

    const response = await BookService.updateBook(bookId, updatedBook);

    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(`${API_URL}/${bookId}`, updatedBook);
    expect(response.data).toEqual(mockResponseData);
  });

  test('deleteBook should call axios.delete with the correct URL and ID', async () => {
    const bookId = 'delete-id-789';
    const mockResponseData = { message: 'Deleted' }; // Ответ API может отличаться
    axios.delete.mockResolvedValue({ data: mockResponseData });

    const response = await BookService.deleteBook(bookId);

    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/${bookId}`);
    expect(response.data).toEqual(mockResponseData);
  });

  test('searchBooks should call axios.get with the correct URL and query param', async () => {
    const query = 'test search';
    const mockData = [{ id: 's1', title: 'Test Search Result' }];
    axios.get.mockResolvedValue({ data: mockData });

    const response = await BookService.searchBooks(query);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/search?query=${query}`);
    expect(response.data).toEqual(mockData);
  });

  // Тест для isApiAvailable (если бы он использовался и был раскомментирован)
  // test('isApiAvailable should call health check endpoint', async () => {
  //   axios.get.mockResolvedValue({ status: 200 }); // Мок успешного ответа health check
  //   const available = await BookService.isApiAvailable();
  //   expect(axios.get).toHaveBeenCalledWith(`${API_URL}/health`, { timeout: 2000 });
  //   expect(available).toBe(true);
  // });

  // test('isApiAvailable should return false on error', async () => {
  //   axios.get.mockRejectedValue(new Error('Network error')); // Мок ошибки health check
  //   const available = await BookService.isApiAvailable();
  //    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/health`, { timeout: 2000 });
  //   expect(available).toBe(false);
  // });
});