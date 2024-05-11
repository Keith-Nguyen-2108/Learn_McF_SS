export enum DateOption {
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

export enum QuarterOrder {
  FirstQuarter = "From first quarter",
  SecondQuarter = "From second quarter",
  ThirdQuarter = "From third quarter",
  LastQuarter = "From last quarter",
}

export const DATE_OPTIONS = [
  { name: DateOption.ThisMonth },
  { name: DateOption.ThisWeek },
  { name: DateOption.Today },
  { name: DateOption.Yesterday },
  { name: DateOption.Last7Days },
  { name: DateOption.Last30Days },
  { name: DateOption.Last90Days },
  { name: DateOption.LastMonth },
  { name: DateOption.Last3Months },
  { name: DateOption.LastYear },
  { name: DateOption.WeekToDate },
  { name: DateOption.MonthToDate },
  { name: DateOption.QuarterToDate },
  { name: DateOption.YearToDate },
  { name: DateOption.Custom },
];

export const QUARTER_OPTIONS = [
  { name: QuarterOrder.FirstQuarter },
  { name: QuarterOrder.SecondQuarter },
  { name: QuarterOrder.ThirdQuarter },
  { name: QuarterOrder.LastQuarter },
];
