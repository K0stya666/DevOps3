CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    publication_date DATE,
    isbn VARCHAR(20),
    genre VARCHAR(100),
    available_copies INTEGER DEFAULT 0,
    total_copies INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO books (title, author, description, publication_date, isbn, genre, available_copies, total_copies) VALUES
('1984', 'Джордж Оруэлл', 'Роман-антиутопия о тоталитарном обществе будущего', '1949-06-08', '9780451524935', 'Антиутопия', 5, 5),
('Война и мир', 'Лев Толстой', 'Роман-эпопея о российском обществе в эпоху наполеоновских войн', '1869-01-01', '9785171147426', 'Роман', 3, 5),
('Мастер и Маргарита', 'Михаил Булгаков', 'Роман о добре и зле, любви и предательстве', '1967-01-01', '9785699980871', 'Фантастика', 4, 4);
