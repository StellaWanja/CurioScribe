import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import initializeDB from "../database/database.js";

const pool = await initializeDB();
const routes = express.Router();

const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+\.[A-Za-z]/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

// signup route
routes.post("/signup", async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      confirm_password,
    } = req.body;

    /* VALIDATION */
    // null values
    if (
      !first_name ||
      !last_name ||
      !username ||
      !email ||
      !password ||
      !confirm_password
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in the required fields", status: 400 });
    }

    // check if email is valid
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address", status: 400 });
    }

    // check if password is valid
    if (!passwordRegex.test(password)) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long with at least 1 digit, a special character, an uppercase letter, and a lowercase letter", status: 400 });
    }

    // check if passwords match
    if (password !== confirm_password) {
        return res
          .status(400)
          .json({ message: "Passwords entered do not match", status: 400 });
    }

    // hash password


    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO users (first_name, last_name, username, email, password, confirm_password) VALUES (?, ?, ?, ?, ?, ?)",
      [first_name, last_name, username, email, password, confirm_password]
    );
    connection.release();
    res.status(200).json({ message: "Registration successful!", status: 200 });
  } catch (error) {
    console.error("Error signing up:", error);
    res
      .status(500)
      .json({ message: `Error signing up: ${error}`, status: 500 });
  }
});

export default routes;
