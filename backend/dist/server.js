import express from "express";
import authRoutes from './routes/authRoutes.js';
//use env 
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT;
//middleware for parsing body
app.use(express.json());
//routes
app.use('/', authRoutes);
//listen
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
//# sourceMappingURL=server.js.map