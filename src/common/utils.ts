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
