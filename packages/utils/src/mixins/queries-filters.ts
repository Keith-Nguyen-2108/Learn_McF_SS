import { FilterParams } from "@/types";

type Entry<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

export const generateQueryString = (
  parameters: Record<string, any>
): string => {
  const queries = Object.entries(parameters).map(
    ([key, val]: Entry<Record<string, any>>) => {
      return Array.isArray(val) ? `${key}=${val}` : `${key}=${val}`;
    }
  );

  return queries.length > 0 ? queries.join("&") : "";
};

export const generateFilterString = (
  parameters: Record<string, any>
): string => {
  if (Object.keys(parameters).length === 0) return "";

  const andClauses = Object.entries(parameters).map(
    ([key, val]: Entry<Record<string, any>>) => {
      const { operator, value } = val as FilterParams;
      if (key.includes(",")) {
        const orClauses = key
          .split(",")
          .map(
            (_key) => `(${_key} ${operator} "${encodeURIComponent(value)}")`
          );
        return `(${orClauses.join(" or ")})`;
      }
      return `(${key} ${operator} "${encodeURIComponent(value)}")`;
    }
  );

  return andClauses.length > 0 ? `fe=(${andClauses.join(" and ")})` : "";
};
