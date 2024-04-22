import mysql from "mysql2";
import dotenv from "dotenv";
import { createDB, useDB } from "./schema/database_schema_v1.js";

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  })
  .promise();

//initialize database
const initializeDB = async () => {
  try {
    const connection = await pool.getConnection();
    // create and use db if db doesn't exist
    await connection.query(createDB);
    await connection.query(useDB);

    console.log("Connected to the database!");
    connection.release();
    return pool;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error(error);
  }
};

export default initializeDB;
