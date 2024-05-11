import { VueElement } from "vue";
import { ItemType } from "ant-design-vue";
import dayjs, { OpUnitType } from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

import { ItemDate } from "@learnss/utils";

import {
  DATE_OPTIONS,
  DateOption,
  QUARTER_OPTIONS,
  QuarterOrder,
} from "@/constants";

dayjs.extend(quarterOfYear);

export const useCustomDateRangePicker = () => {
  const getItem = (
    label: VueElement | string,
    key: string,
    value: any,
    children?: ItemType[],
    disabled = false,
    type?: "group"
  ): ItemType => {
    return {
      key,
      children,
      label,
      value,
      disabled,
      type,
    } as ItemType;
  };

  const getOptionValue = (option: DateOption | QuarterOrder): ItemDate[] => {
    switch (option) {
      case DateOption.ThisMonth:
        return [dayjs().startOf("month"), dayjs().endOf("month")];
      case DateOption.ThisWeek:
        return [dayjs().startOf("week"), dayjs().endOf("week")];
      case DateOption.Today:
        return [dayjs(), dayjs()];
      case DateOption.Yesterday:
        return [dayjs().subtract(1, "days"), dayjs().subtract(1, "days")];
      case DateOption.LastWeek:
        return [
          dayjs().subtract(1, "weeks").startOf("week"),
          dayjs().subtract(1, "weeks").endOf("week"),
        ];
      case DateOption.Last7Days:
        return [dayjs().subtract(7, "days"), dayjs()];
      case DateOption.Last30Days:
        return [dayjs().subtract(30, "days"), dayjs()];
      case DateOption.Last90Days:
        return [dayjs().subtract(90, "days"), dayjs()];
      case DateOption.LastMonth:
        return [
          dayjs().subtract(1, "months").startOf("month"),
          dayjs().subtract(1, "months").endOf("month"),
        ];
      case DateOption.Last3Months:
        return [
          dayjs().subtract(3, "months").startOf("month"),
          dayjs().subtract(1, "months").endOf("month"),
        ];
      case DateOption.LastYear:
        return [
          dayjs().subtract(1, "years").startOf("year"),
          dayjs().subtract(1, "years").endOf("year"),
        ];
      case DateOption.WeekToDate:
        return [dayjs().startOf("week"), dayjs()];
      case DateOption.MonthToDate:
        return [dayjs().startOf("month"), dayjs()];
      case QuarterOrder.FirstQuarter:
        return [dayjs().quarter(1).startOf("quarter"), dayjs()];
      case QuarterOrder.SecondQuarter:
        return [dayjs().quarter(2).startOf("quarter"), dayjs()];
      case QuarterOrder.ThirdQuarter:
        return [dayjs().quarter(3).startOf("quarter"), dayjs()];
      case QuarterOrder.LastQuarter:
        return [dayjs().quarter(4).startOf("quarter"), dayjs()];
      case DateOption.YearToDate:
        return [dayjs().startOf("year"), dayjs()];
    }
  };

  const getDateOptions = (newOptions?: any, allowCustom = false) => {
    let options = (newOptions || DATE_OPTIONS).map((option) => ({
      ...(option.name !== DateOption.QuarterToDate ? option : {}),
      value: getOptionValue(option.name) as [dayjs.Dayjs, dayjs.Dayjs],
      ...(option.name === DateOption.QuarterToDate
        ? getItem(
            DateOption.QuarterToDate,
            DateOption.QuarterToDate,
            undefined,
            QUARTER_OPTIONS.map((option) =>
              getItem(
                option.name,
                option.name,
                getOptionValue(option.name) as [dayjs.Dayjs, dayjs.Dayjs],
                undefined,
                !(getOptionValue(option.name)[0] as dayjs.Dayjs).isBefore(
                  getOptionValue(option.name)[1]
                )
              )
            )
          )
        : {}),
    }));

    if (!allowCustom) {
      options = options.filter((item) => item.name !== DateOption.Custom);
    }

    return options;
  };

  return {
    getDateOptions,
    getOptionValue,
  };
};
