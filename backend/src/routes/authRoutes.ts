import express, { Request, Response } from "express";
import { register } from "../controllers/userController.js";
import initializeDB from "../database/database.js";

const pool = await initializeDB();


const routes = express.Router();

routes.post('/register', async(req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
        connection.release();
        res.status(200).send('Signed up successfully');
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).send('Error signing up');
    }
});

export default routes;
