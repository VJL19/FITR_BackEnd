import mysql from "mysql";
import loadConfig from "../utils/types/config.types";

const config = loadConfig();

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  port: config.port,
  password: config.password,
  database: config.database,
  multipleStatements: true,
});

export const test_connection = connection.connect((err) => {
  if (err) {
    console.log("Database connection failed: ", err);
  } else {
    console.log("Connected to database");
  }
});

export default connection;
