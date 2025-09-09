// MockDataService.js - сервис с моковыми данными

// Генерация случайного ID
const generateId = () => {
    return Math.floor(Math.random() * 10000).toString();
  };
  
  // Текущая дата в формате ISO
  const today = new Date().toISOString().split('T')[0];
  
  // Моковые данные книг
  const mockBooks = [
    {
      id: "1",
      title: "Война и мир",
      author: "Лев Толстой",
      description: "Роман-эпопея, описывающий события войн против Наполеона: Отечественной войны 1812 года и заграничных походов русской армии 1813—1814 годов.",
      publicationDate: "1869-01-01",
      isbn: "9785171147426",
      genre: "Роман",
      availableCopies: 3,
      totalCopies: 5,
      createdAt: today
    },
    {
      id: "2",
      title: "Мастер и Маргарита",
      author: "Михаил Булгаков",
      description: "Роман, написанный в период с 1928 по 1940 год, сочетающий в себе сатиру, фантастику, любовную историю и элементы мистики.",
      publicationDate: "1967-01-01",
      isbn: "9785699980871",
      genre: "Фантастика",
      availableCopies: 2,
      totalCopies: 4,
      createdAt: today
    },
    {
      id: "3",
      title: "Преступление и наказание",
      author: "Фёдор Достоевский",
      description: "Социально-психологический и социально-философский роман, над которым Достоевский работал в 1865-1866 годах.",
      publicationDate: "1866-01-01",
      isbn: "9785171355487",
      genre: "Роман",
      availableCopies: 1,
      totalCopies: 3,
      createdAt: today
    },
    {
      id: "4",
      title: "1984",
      author: "Джордж Оруэлл",
      description: "Роман-антиутопия, изображающий мир тоталитарного будущего, в котором общество находится под контролем Партии и её лидера - Большого Брата.",
      publicationDate: "1949-06-08",
      isbn: "9785389074331",
      genre: "Антиутопия",
      availableCopies: 4,
      totalCopies: 6,
      createdAt: today
    },
    {
      id: "5",
      title: "Гарри Поттер и философский камень",
      author: "Дж. К. Роулинг",
      description: "Первая книга серии романов о юном волшебнике Гарри Поттере, рассказывающая о его первом годе обучения в школе чародейства и волшебства Хогвартс.",
      publicationDate: "1997-06-26",
      isbn: "9785389077157",
      genre: "Фэнтези",
      availableCopies: 5,
      totalCopies: 8,
      createdAt: today
    },
    {
      id: "6",
      title: "Властелин колец",
      author: "Дж. Р. Р. Толкин",
      description: "Эпическое фэнтези-произведение, повествующее о путешествии хоббита Фродо с целью уничтожить Кольцо Всевластия.",
      publicationDate: "1954-07-29",
      isbn: "9785171203139",
      genre: "Фэнтези",
      availableCopies: 2,
      totalCopies: 3,
      createdAt: today
    }
  ];
  
  // Сохраним копию книг в localStorage при первой загрузке
  const initializeLocalStorage = () => {
    if (!localStorage.getItem('mockBooks')) {
      localStorage.setItem('mockBooks', JSON.stringify(mockBooks));
    }
  };
  
  // Получить все книги
  const getAllBooks = () => {
    initializeLocalStorage();
    return new Promise((resolve) => {
      setTimeout(() => {
        const books = JSON.parse(localStorage.getItem('mockBooks')) || [];
        resolve({ data: books });
      }, 500); // Имитация задержки сети
    });
  };
  
  // Получить книгу по ID
  const getBookById = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const books = JSON.parse(localStorage.getItem('mockBooks')) || [];
        const book = books.find(book => book.id === id);
        
        if (book) {
          resolve({ data: book });
        } else {
          reject({ response: { data: { message: 'Book not found' } } });
        }
      }, 500);
    });
  };
  
  // Создать новую книгу
  const createBook = (bookData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const books = JSON.parse(localStorage.getItem('mockBooks')) || [];
        const newBook = {
          ...bookData,
          id: generateId(),
          createdAt: new Date().toISOString()
        };
        
        books.push(newBook);
        localStorage.setItem('mockBooks', JSON.stringify(books));
        
        resolve({ data: newBook });
      }, 700);
    });
  };
  
  // Обновить книгу
  const updateBook = (id, bookData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const books = JSON.parse(localStorage.getItem('mockBooks')) || [];
        const index = books.findIndex(book => book.id === id);
        
        if (index !== -1) {
          const updatedBook = {
            ...books[index],
            ...bookData,
            id,
            updatedAt: new Date().toISOString()
          };
          
          books[index] = updatedBook;
          localStorage.setItem('mockBooks', JSON.stringify(books));
          
          resolve({ data: updatedBook });
        } else {
          reject({ response: { data: { message: 'Book not found' } } });
        }
      }, 700);
    });
  };
  
  // Удалить книгу
  const deleteBook = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const books = JSON.parse(localStorage.getItem('mockBooks')) || [];
        const index = books.findIndex(book => book.id === id);
        
        if (index !== -1) {
          books.splice(index, 1);
          localStorage.setItem('mockBooks', JSON.stringify(books));
          
          resolve({ data: { message: 'Book deleted successfully' } });
        } else {
          reject({ response: { data: { message: 'Book not found' } } });
        }
      }, 700);
    });
  };
  
  // Поиск книг
  const searchBooks = (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const books = JSON.parse(localStorage.getItem('mockBooks')) || [];
        const lowerQuery = query.toLowerCase();
        
        const results = books.filter(book => 
          book.title.toLowerCase().includes(lowerQuery) || 
          book.author.toLowerCase().includes(lowerQuery) || 
          (book.isbn && book.isbn.includes(query)) ||
          (book.genre && book.genre.toLowerCase().includes(lowerQuery))
        );
        
        resolve({ data: results });
      }, 700);
    });
  };
  
  // Экспортируем все функции
  const MockBookService = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    searchBooks
  };
  
  export default MockBookService;