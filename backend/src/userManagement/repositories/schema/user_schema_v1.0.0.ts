// create users table
export const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        otp VARCHAR(255),
        otpExpire VARCHAR(255)
    );
`;

// create new user
export const addUser = `INSERT INTO users (id, firstName, lastName, username, email, password) VALUES (?, ?, ?, ?, ?, ?)`;

// check for duplication
export const duplicateEmailChecker = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
export const duplicateUsernameChecker = `SELECT COUNT(*) AS count FROM users WHERE username = ?`;

// get user details
export const getUserDetails = `SELECT * FROM users WHERE email = ?`;
export const getUserDetailsWithId = `SELECT * FROM users WHERE id = ?`;

// update otp cols for reset
export const updateUserOTP = `UPDATE users SET otp = ?, otpExpire = ? WHERE email = ?`;
export const getDetsfromOTP = `SELECT * FROM users WHERE otp = ? AND otpExpire > NOW()`;
export const resetPassword = `UPDATE users SET password = ?, otp = null, otpExpire = null WHERE otp = ?`;
