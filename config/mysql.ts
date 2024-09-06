import mysql from "mysql";
import loadConfig from "../utils/types/config.types";

const config = loadConfig();
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  database: config.database,
  multipleStatements: true,
});

export default connection;
