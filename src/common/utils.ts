/** @format */

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