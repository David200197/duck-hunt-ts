export type SnakeCase<S extends string> =
  S extends `${infer First}-${infer Rest}`
    ? `${First}_${SnakeCase<Rest>}`
    : S extends `${infer First} ${infer Rest}`
    ? `${First}_${SnakeCase<Rest>}`
    : S extends `${infer First}${infer Rest}`
    ? `${First extends Uppercase<First>
        ? "_"
        : ""}${Lowercase<First>}${SnakeCase<Rest>}`
    : S;
