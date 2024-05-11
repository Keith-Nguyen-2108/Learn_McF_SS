import { FilterParams } from "@/types";

type Entry<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

export const generateQueryString = (
  parameters: Record<string, any>
): string => {
  let queries: string[] = [];

  Object.entries(parameters).forEach(
    ([key, val]: Entry<Record<string, any>>) => {
      if (Array.isArray(val)) {
        queries.push(`${String(key)}=${("" + val).toString()}`);
      } else {
        queries.push(`${String(key)}=${val}`);
      }
    }
  );

  if (queries.length === 0) return "";

  return queries.join("&");
};

export const generateFilterString = (
  parameters: Record<string, any>
): string => {
  let feString = "";

  if (!Object.keys(parameters).length) return feString;

  let andClauses: string[] = [];

  Object.entries(parameters).forEach(
    ([key, val]: Entry<Record<string, any>>) => {
      const { operator, value } = val as FilterParams;

      if (key.includes(",")) {
        const orClauses = key
          .split(",")
          .map(
            (_key) =>
              `(${_key} ${operator} ${"`" + encodeURIComponent(value) + "`"})`
          );

        andClauses.push(`(${orClauses.join("or")})`);

        return;
      }

      andClauses.push(
        `(${key} ${operator} ${"`" + encodeURIComponent(value) + "`"})`
      );
    }
  );

  if (!andClauses || andClauses.length === 0) return "";

  return `fe=(${andClauses.join("and")})`;
};
