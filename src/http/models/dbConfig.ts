/** @format */
import { Dialect, Sequelize } from "sequelize";
const dbDialect: Dialect = "postgres";
export const dbConfig = {
  HOST: process.env.PGHOST || "",
  USER: process.env.PGUSER || "",
  PASSWORD: process.env.PGPASSWORD,
  DB: process.env.PGDATABASE || "",
  dialect: dbDialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelizeConnection = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
  }
);

export { sequelizeConnection };
