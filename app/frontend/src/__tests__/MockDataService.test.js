import MockBookService from '../MockDataService';

// Мокаем localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Используем фейковые таймеры
jest.useFakeTimers();

describe('MockBookService', () => {
  const initialBooksCount = 6; // Изначальное количество книг в моковых данных

  beforeEach(() => {
    // Очищаем localStorage и сбрасываем таймеры перед каждым тестом
    localStorage.clear();
    // Инициализируем localStorage с начальными данными (вызов любой функции сервиса сделает это)
    MockBookService.getAllBooks();
    jest.advanceTimersByTime(500); // Пропускаем setTimeout в getAllBooks
  });

  test('getAllBooks should return initial mock books from localStorage', async () => {
    const promise = MockBookService.getAllBooks();
    jest.advanceTimersByTime(500); // Пропускаем setTimeout
    const response = await promise;

    expect(response.data).toBeInstanceOf(Array);
    expect(response.data.length).toBe(initialBooksCount);
    expect(response.data[0].title).toBe('Война и мир'); // Проверяем первую книгу
  });

  test('getBookById should return the correct book', async () => {
    const bookId = '2'; // Мастер и Маргарита
    const promise = MockBookService.getBookById(bookId);
    jest.advanceTimersByTime(500);
    const response = await promise;

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(bookId);
    expect(response.data.title).toBe('Мастер и Маргарита');
  });

  test('getBookById should reject if book not found', async () => {
    const bookId = 'nonexistent-id';
    const promise = MockBookService.getBookById(bookId);
    jest.advanceTimersByTime(500);

    await expect(promise).rejects.toEqual({
      response: { data: { message: 'Book not found' } },
    });
  });

  test('createBook should add a new book to localStorage and return it with an id', async () => {
    const newBookData = {
      title: 'New Mock Book',
      author: 'Mock Author',
      description: 'Desc',
      publicationDate: '2024-01-01',
      isbn: '999888777',
      genre: 'Mock Genre',
      availableCopies: 1,
      totalCopies: 1,
    };
    const createPromise = MockBookService.createBook(newBookData);
    jest.advanceTimersByTime(700); // Пропускаем setTimeout
    const createResponse = await createPromise;

    expect(createResponse.data).toBeDefined();
    expect(createResponse.data.id).toBeDefined(); // ID должен быть сгенерирован
    expect(createResponse.data.title).toBe(newBookData.title);
    expect(createResponse.data.createdAt).toBeDefined();

    // Проверяем, что книга добавлена в localStorage
    const getAllPromise = MockBookService.getAllBooks();
    jest.advanceTimersByTime(500);
    const getAllResponse = await getAllPromise;
    expect(getAllResponse.data.length).toBe(initialBooksCount + 1);
    const addedBook = getAllResponse.data.find(b => b.id === createResponse.data.id);
    expect(addedBook).toBeDefined();
    expect(addedBook.title).toBe(newBookData.title);
  });

  test('updateBook should modify the correct book in localStorage', async () => {
    const bookIdToUpdate = '3'; // Преступление и наказание
    const updateData = {
      title: 'Updated Title',
      availableCopies: 0,
    };

    const updatePromise = MockBookService.updateBook(bookIdToUpdate, updateData);
    jest.advanceTimersByTime(700);
    const updateResponse = await updatePromise;

    expect(updateResponse.data.id).toBe(bookIdToUpdate);
    expect(updateResponse.data.title).toBe(updateData.title);
    expect(updateResponse.data.availableCopies).toBe(updateData.availableCopies);
    expect(updateResponse.data.author).toBe('Фёдор Достоевский'); // Остальные поля не должны измениться
    expect(updateResponse.data.updatedAt).toBeDefined();

    // Проверяем localStorage
    const getPromise = MockBookService.getBookById(bookIdToUpdate);
    jest.advanceTimersByTime(500);
    const getResponse = await getPromise;
    expect(getResponse.data.title).toBe(updateData.title);
    expect(getResponse.data.availableCopies).toBe(updateData.availableCopies);
  });

   test('updateBook should reject if book not found', async () => {
    const bookIdToUpdate = 'nonexistent-id';
    const updateData = { title: 'Wont Update' };
    const promise = MockBookService.updateBook(bookIdToUpdate, updateData);
    jest.advanceTimersByTime(700);

    await expect(promise).rejects.toEqual({
      response: { data: { message: 'Book not found' } },
    });
  });

  test('deleteBook should remove the book from localStorage', async () => {
    const bookIdToDelete = '4'; // 1984

    // Убедимся, что книга есть
    const getPromiseBefore = MockBookService.getBookById(bookIdToDelete);
     jest.advanceTimersByTime(500);
    await expect(getPromiseBefore).resolves.toBeDefined();

    // Удаляем
    const deletePromise = MockBookService.deleteBook(bookIdToDelete);
    jest.advanceTimersByTime(700);
    const deleteResponse = await deletePromise;
    expect(deleteResponse.data.message).toBe('Book deleted successfully');

    // Проверяем, что книги больше нет
    const getPromiseAfter = MockBookService.getBookById(bookIdToDelete);
    jest.advanceTimersByTime(500);
    await expect(getPromiseAfter).rejects.toEqual({
      response: { data: { message: 'Book not found' } },
    });

    // Проверяем общее количество
     const getAllPromise = MockBookService.getAllBooks();
     jest.advanceTimersByTime(500);
     const getAllResponse = await getAllPromise;
     expect(getAllResponse.data.length).toBe(initialBooksCount - 1);
  });

   test('deleteBook should reject if book not found', async () => {
    const bookIdToDelete = 'nonexistent-id';
    const promise = MockBookService.deleteBook(bookIdToDelete);
    jest.advanceTimersByTime(700);

    await expect(promise).rejects.toEqual({
      response: { data: { message: 'Book not found' } },
    });
  });

  test('searchBooks should find books by title', async () => {
    const promise = MockBookService.searchBooks('мир'); // Война и мир
    jest.advanceTimersByTime(700);
    const response = await promise;

    expect(response.data.length).toBe(1);
    expect(response.data[0].title).toBe('Война и мир');
  });

   test('searchBooks should find books by author', async () => {
    const promise = MockBookService.searchBooks('Толстой'); // Лев Толстой
    jest.advanceTimersByTime(700);
    const response = await promise;

    expect(response.data.length).toBe(1);
    expect(response.data[0].author).toBe('Лев Толстой');
  });

   test('searchBooks should find books by genre (case-insensitive)', async () => {
    const promise = MockBookService.searchBooks('фэнтези'); // Гарри Поттер, Властелин колец
    jest.advanceTimersByTime(700);
    const response = await promise;

    expect(response.data.length).toBe(2);
    expect(response.data.map(b => b.title)).toEqual(
        expect.arrayContaining(['Гарри Поттер и философский камень', 'Властелин колец'])
    );
  });

   test('searchBooks should find books by isbn', async () => {
    const promise = MockBookService.searchBooks('9785389074331'); // 1984
    jest.advanceTimersByTime(700);
    const response = await promise;

    expect(response.data.length).toBe(1);
    expect(response.data[0].title).toBe('1984');
  });

   test('searchBooks should return empty array if no match', async () => {
    const promise = MockBookService.searchBooks('nonexistent query');
    jest.advanceTimersByTime(700);
    const response = await promise;

    expect(response.data).toEqual([]);
  });

});