import { E_FilterOperators, E_JoinCondition } from "@/constants";

export type T_FilterParams = {
  operator: E_FilterOperators | E_FilterOperators[];
  joinCondition?: E_JoinCondition;
  value: string;
};

export type T_Filter = Record<string, T_FilterParams>;

export type T_AdvancedFilterValue = {
  operator: E_FilterOperators | E_FilterOperators[];
  E_JoinCondition?: E_JoinCondition;
  value: string;
};
