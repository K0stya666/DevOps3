import MockBookService from '../MockDataService';

// Мок localStorage
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

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Управляем «сетевой» задержкой
jest.useFakeTimers();

describe('MockBookService', () => {
    const initialBooksCount = 6; // кол-во книг в исходном наборе

    beforeEach(() => {
        localStorage.clear();
        // Инициализация localStorage начальными данными
        MockBookService.getAllBooks();
        jest.advanceTimersByTime(500);
    });

    test('getAllBooks should return initial mock books from localStorage', async () => {
        const promise = MockBookService.getAllBooks();
        jest.advanceTimersByTime(500);
        const response = await promise;

        expect(response.data).toBeInstanceOf(Array);
        expect(response.data.length).toBe(initialBooksCount);
        expect(response.data[0].title).toBe('Война и мир'); // проверяем первую книгу
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
        jest.advanceTimersByTime(700);
        const createResponse = await createPromise;

        expect(createResponse.data).toBeDefined();
        expect(createResponse.data.id).toBeDefined();
        expect(createResponse.data.title).toBe(newBookData.title);
        expect(createResponse.data.createdAt).toBeDefined();

        // Проверяем, что запись попала в localStorage
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
        // Автор должен остаться исходным
        expect(updateResponse.data.author).toBe('Фёдор Достоевский');
        expect(updateResponse.data.updatedAt).toBeDefined();

        // Проверим, что в хранилище обновилось
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

        // Теперь её быть не должно
        const getPromiseAfter = MockBookService.getBookById(bookIdToDelete);
        jest.advanceTimersByTime(500);
        await expect(getPromiseAfter).rejects.toEqual({
            response: { data: { message: 'Book not found' } },
        });

        // И общее количество уменьшилось
        const getAllPromise = MockBookService.getAllBooks();
        jest.advanceTimersByTime(500);
        const getAllResponse = await getAllPromise;
        expect(getAllResponse.data.length).toBe(initialBooksCount - 1);
    });

    test('searchBooks should find books by title', async () => {
        const promise = MockBookService.searchBooks('Война'); // найдёт «Война и мир»
        jest.advanceTimersByTime(700);
        const response = await promise;

        expect(response.data.length).toBe(1);
        expect(response.data[0].title).toBe('Война и мир');
    });

    test('searchBooks should find books by author', async () => {
        const promise = MockBookService.searchBooks('Толстой'); // найдёт автора «Лев Толстой»
        jest.advanceTimersByTime(700);
        const response = await promise;

        expect(response.data.length).toBe(1);
        expect(response.data[0].author).toBe('Лев Толстой');
    });

    test('searchBooks should find books by genre (case-insensitive)', async () => {
        const promise = MockBookService.searchBooks('фэнтези'); // жанр у двух книг
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
