import express, {Express, Request, Response} from "express";
import authRoutes from './routes/authRoutes.js';

//use env 
import dotenv from "dotenv";
dotenv.config();

const app : Express = express();
const port  = process.env.PORT;

//middleware for parsing body
app.use(express.json());

//routes
app.use('/', authRoutes);

//listen
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})