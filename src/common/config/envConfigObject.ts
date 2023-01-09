/** @format */

import dotenv from "dotenv";
const getEnvConfigObject = () => {
  dotenv.config();
  return {
    isValidationEnabled: process.env.IS_VALIDATION_ENABLED === "true",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  };
};

export const envConfigObject = getEnvConfigObject();
