export enum FilterOperators {
  FILTERS_GREATER_THAN = "Gt",
  FILTERS_LESS_THAN = "Lt",
  FILTERS_EQUAL = "Eq",
  FILTERS_LESS_THAN_OR_EQUAL = "Le",
  FILTERS_GREATER_THAN_OR_EQUAL = "Ge",
  FILTERS_NOT_EQUAL = "Ne",
  FILTERS_CONTAINS = "Contains",
  FILTERS_STARTS_WITH = "StartsWith",
  FILTERS_ENDS_WITH = "EndsWith",
  FILTERS_IN = "In",
}

export enum JoinCondition {
  And = "and",
  Or = "or",
}

export type AdvancedFilterValue = {
  operator: FilterOperators | FilterOperators[];
  joinCondition?: JoinCondition;
  value: string;
};
