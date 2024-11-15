import mysql from "mysql";
import loadConfig from "../utils/types/config.types";

const config = loadConfig();

let connection: mysql.Connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  port: config.port,
  password: config.password,
  database: config.database,
  multipleStatements: true,
  connectTimeout: 10000,
  timeout: 30000,
});

function handleReconnect() {
  connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    port: config.port,
    password: config.password,
    database: config.database,
    multipleStatements: true,
    connectTimeout: 10000,
    timeout: 30000,
  });
}

export const test_connection = connection.connect((err) => {
  if (err) {
    console.log("Database connection failed: ", err);
  } else {
    console.log("Connected to database");
  }
});
connection.on("error", (err) => {
  console.error("MySQL error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNREFUSED") {
    handleReconnect();
  } else {
    // If the error is not recoverable, you can handle it here
    console.error("Non-recoverable MySQL error:", err);
  }
});
export default connection;
