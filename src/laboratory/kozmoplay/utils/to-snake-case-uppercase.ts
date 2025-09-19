// Función helper separada para mejor legibilidad y testing
export function toSnakeCaseUppercase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2") // camelCase to snake_case
    .replace(/[-\s]+/g, "_") // kebab-case y espacios a underscores
    .toUpperCase(); // a mayúsculas
}
