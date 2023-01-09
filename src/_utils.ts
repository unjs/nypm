import { normalize } from "pathe";

export async function _findup<T> (cwd: string, match: (path: string) => T | Promise<T>): Promise<T | undefined> {
  const segments = normalize(cwd).split("/");
  while (segments.length > 0) {
    const path = segments.join("/");
    const result = await match(path);
    if (result) {
      return result;
    }
    segments.pop();
  }
}
