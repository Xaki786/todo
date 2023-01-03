/** @format */

export function getEnvironment() {
  return process.env.NODE_ENV || "development";
}
export const appDevelopmentLogger = (data: unknown) => {
  const env = getEnvironment();
  if (env !== "development") return;
  console.log("=======================");
  console.log(data);
  console.log("=======================");
};
