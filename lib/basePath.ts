export const basePath =
  process.env.NODE_ENV === "production" ? "/KORODUR-Sanierung_app" : "";

export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}
