import { FilterOperators, JoinCondition } from "@/constants";

export type FilterParams = {
  operator: FilterOperators | FilterOperators[];
  joinCondition?: JoinCondition;
  value: string;
};

export type Filter = Record<string, FilterParams>;
