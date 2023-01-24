/** @format */
import argon2 from "argon2";

export function getEnvironment() {
  return process.env.NODE_ENV || "development";
}
type loggerOptions = {
  context?: string;
};
export const appDevelopmentLogger = (
  data: unknown,
  options?: loggerOptions
) => {
  const context = options?.context ?? "No Context Provided";
  const env = getEnvironment();
  if (env !== "development") return;
  console.log("=================================================");
  console.log(`               Context: ${context}               `);
  console.log("=================================================");
  console.log(data);
  console.log("=================================================");
};

export function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

export class PasswordManager {
  public static encryptPassword = async (
    plainPassword: string
  ): Promise<string> => {
    return await argon2.hash(plainPassword);
  };

  public static verifyPassword = async (
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return await argon2.verify(hashedPassword, plainPassword);
  };
}
