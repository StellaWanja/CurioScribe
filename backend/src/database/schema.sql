CREATE DATABASE curioscribe;
USE curioscribe;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created DATETIME NOT NULL DEFAULT NOW()
);

INSERT INTO users (username, email, password)
VALUES  ("user1", "user1@test.com", "123456" ),
        ("user2", "user2@test.com", "123456");