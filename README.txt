для запуска надо сделать локальный сервер и бд, мы использовали xampp
вот sql запрос для бд
-- Пользователи и аутентификация
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Бронирование столов
CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id), -- если пользователь авторизован
    guest_name VARCHAR(100) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(12) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests_count VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- confirmed, cancelled, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Обратная связь
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

( мы несколько дней бились с ajax, но у нас ничего не вышло, скинули то, что получилось)