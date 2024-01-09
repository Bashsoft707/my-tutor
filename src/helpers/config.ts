import { config } from "dotenv";
config();

export const HAS_CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  SMPT_HOST,
  SMPT_PORT,
  SMPT_SERVICE,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  CLIENT_URL,
  PG_USERNAME,
  PG_PASSWORD,
  PG_DB,
  PG_HOST,
  OPENAI_API_KEY,
  MONGO_URL,
  BARD_API_KEY
} = process.env;
