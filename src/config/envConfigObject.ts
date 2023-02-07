/** @format */

import dotenv from "dotenv";

const getEnvConfigObject = () => {
  dotenv.config();
  return {
    isValidationEnabled: process.env.IS_VALIDATION_ENABLED === "true",
    ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "",
    EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS),
  };
};

export const envConfigObject = getEnvConfigObject();
