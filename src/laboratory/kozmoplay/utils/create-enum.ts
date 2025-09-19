import type { SnakeCase } from "../interfaces/snake-case";
import { toSnakeCaseUppercase } from "./to-snake-case-uppercase";

export function createEnum<T extends Record<string, unknown>>(
  record: T
): { [K in keyof T as Uppercase<SnakeCase<Extract<K, string>>>]: K } {
  const enumObj = {} as Record<string, keyof T>;

  for (const key of Object.keys(record) as Array<keyof T>) {
    const snakeCaseKey = toSnakeCaseUppercase(String(key));
    enumObj[snakeCaseKey] = key;
  }

  return enumObj as {
    [K in keyof T as Uppercase<SnakeCase<Extract<K, string>>>]: K;
  };
}
