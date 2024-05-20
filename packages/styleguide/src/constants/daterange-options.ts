export enum E_DateOption {
  ThisMonth = "This month",
  ThisWeek = "This week",
  Today = "Today",
  Yesterday = "Yesterday",
  LastWeek = "Last week",
  Last7Days = "Last 7 days",
  Last30Days = "Last 30 days",
  Last90Days = "Last 90 days",
  LastMonth = "Last month",
  Last3Months = "Last 3 months",
  LastYear = "Last Year",
  WeekToDate = "Week to date",
  MonthToDate = "Month to date",
  QuarterToDate = "Quarter to date",
  YearToDate = "Year to date",
  Custom = "Custom Date Range",
}

export enum E_QuarterOrder {
  FirstQuarter = "From first quarter",
  SecondQuarter = "From second quarter",
  ThirdQuarter = "From third quarter",
  LastQuarter = "From last quarter",
}

export const C_DATE_OPTIONS = [
  { name: E_DateOption.ThisMonth },
  { name: E_DateOption.ThisWeek },
  { name: E_DateOption.Today },
  { name: E_DateOption.Yesterday },
  { name: E_DateOption.Last7Days },
  { name: E_DateOption.Last30Days },
  { name: E_DateOption.Last90Days },
  { name: E_DateOption.LastMonth },
  { name: E_DateOption.Last3Months },
  { name: E_DateOption.LastYear },
  { name: E_DateOption.WeekToDate },
  { name: E_DateOption.MonthToDate },
  { name: E_DateOption.QuarterToDate },
  { name: E_DateOption.YearToDate },
  { name: E_DateOption.Custom },
];

export const C_QUARTER_OPTIONS = [
  { name: E_QuarterOrder.FirstQuarter },
  { name: E_QuarterOrder.SecondQuarter },
  { name: E_QuarterOrder.ThirdQuarter },
  { name: E_QuarterOrder.LastQuarter },
];
