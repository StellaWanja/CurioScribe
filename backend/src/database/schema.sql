CREATE DATABASE curioscribe;
USE curioscribe;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created DATETIME NOT NULL DEFAULT NOW()
);

INSERT INTO users (first_name, last_name, username, email, password, confirm_password)
VALUES  ("john", "doe", "user1", "user1@test.com", "123456", "123456"),
        ("jane", "doe", "user2", "user2@test.com", "123456", "123456");