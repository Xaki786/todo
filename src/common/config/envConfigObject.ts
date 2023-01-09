/** @format */

import dotenv from "dotenv";
const getEnvConfigObject = () => {
  dotenv.config();
  return {
    isValidationEnabled: process.env.IS_VALIDATION_ENABLED === "true",
  };
};

export const envConfigObject = getEnvConfigObject();
