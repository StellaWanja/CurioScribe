import {Request, Response} from "express";
import initializeDB from "../database/database.js";

const pool = await initializeDB();

export const register = async (req: Request, res: Response) => {
    console.log(req.body)
    // try {
    //     const { username, email, password } = req.body;
    //     const connection = await pool.getConnection();
    //     const [result] = await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    //     connection.release();
    //     res.status(200).send('Signed up successfully');
    // } catch (error) {
    //     console.error('Error signing up:', error);
    //     res.status(500).send('Error signing up');
    // }
}