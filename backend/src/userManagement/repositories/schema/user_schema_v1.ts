export const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;

export const addUser = `INSERT INTO users (firstName, lastName, username, email, password) VALUES (?, ?, ?, ?, ?)`;

export const duplicateEmailChecker = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
export const duplicateUsernameChecker = `SELECT COUNT(*) AS count FROM users WHERE username = ?`;

export const getUserDetails = `SELECT * FROM users WHERE email = ?`;
export const getUserDetailsWithId = `SELECT * FROM users WHERE id = ?`;
