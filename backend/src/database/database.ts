import mysql from "mysql2";

//use env 
import dotenv from "dotenv";
dotenv.config();

//initialize database
const initializeDB = async () => {
  try {
    const pool = mysql
      .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      })
      .promise();

    const connection = await pool.getConnection();
    console.log("Connected to the database!");
    connection.release();
    return pool;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error(error);
  }
};

export default initializeDB;
