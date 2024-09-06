import dotenv from "dotenv";

dotenv.config();

interface IConfig {
  PORT: string | undefined;
  database: string | undefined;
  password: string | undefined;
  host: string | undefined;
  user: string | undefined;
  ACCESS_TOKEN_SECRET: string | undefined;
}

export default function loadConfig(): IConfig {
  return {
    PORT: process.env.PORT,
    database: process.env.database,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  };
}
