/** @format */

export const dbConfig = {
  HOST: process.env.PGHOST || "",
  USER: process.env.PGUSER || "",
  PASSWORD: process.env.PGPASSWORD,
  DB: process.env.PGDATABASE || "",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
