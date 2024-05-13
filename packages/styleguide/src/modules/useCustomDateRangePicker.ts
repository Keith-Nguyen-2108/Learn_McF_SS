import { VueElement } from "vue";
import { ItemType } from "ant-design-vue";
import dayjs, { OpUnitType, ManipulateType } from "dayjs";
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
    const startOf = (unit: OpUnitType) => dayjs().startOf(unit);
    const endOf = (unit: OpUnitType) => dayjs().endOf(unit);
    const subtract = (amount: number, unit: ManipulateType) =>
      dayjs().subtract(amount, unit);

    switch (option) {
      case DateOption.ThisMonth:
        return [startOf("month"), endOf("month")];
      case DateOption.ThisWeek:
        return [startOf("week"), endOf("week")];
      case DateOption.Today:
        return [dayjs(), dayjs()];
      case DateOption.Yesterday:
        return [subtract(1, "days"), subtract(1, "days")];
      case DateOption.LastWeek:
        return [
          subtract(1, "weeks").startOf("week"),
          subtract(1, "weeks").endOf("week"),
        ];
      case DateOption.Last7Days:
        return [subtract(7, "days"), dayjs()];
      case DateOption.Last30Days:
        return [subtract(30, "days"), dayjs()];
      case DateOption.Last90Days:
        return [subtract(90, "days"), dayjs()];
      case DateOption.LastMonth:
        return [
          subtract(1, "months").startOf("month"),
          subtract(1, "months").endOf("month"),
        ];
      case DateOption.Last3Months:
        return [
          subtract(3, "months").startOf("month"),
          subtract(1, "months").endOf("month"),
        ];
      case DateOption.LastYear:
        return [
          subtract(1, "years").startOf("year"),
          subtract(1, "years").endOf("year"),
        ];
      case DateOption.WeekToDate:
        return [startOf("week"), dayjs()];
      case DateOption.MonthToDate:
        return [startOf("month"), dayjs()];
      case QuarterOrder.FirstQuarter:
        return [dayjs().quarter(1).startOf("quarter"), dayjs()];
      case QuarterOrder.SecondQuarter:
        return [dayjs().quarter(2).startOf("quarter"), dayjs()];
      case QuarterOrder.ThirdQuarter:
        return [dayjs().quarter(3).startOf("quarter"), dayjs()];
      case QuarterOrder.LastQuarter:
        return [dayjs().quarter(4).startOf("quarter"), dayjs()];
      case DateOption.YearToDate:
        return [startOf("year"), dayjs()];
    }
  };

  const getDateOptions = (newOptions?: any, allowCustom = false) => {
    const options = (newOptions || DATE_OPTIONS).map((option) => {
      const optionValue = getOptionValue(option.name) as [
        dayjs.Dayjs,
        dayjs.Dayjs
      ];

      if (option.name === DateOption.QuarterToDate) {
        const quarterItems = QUARTER_OPTIONS.map((quarterOption) => {
          const quarterValue = getOptionValue(quarterOption.name) as [
            dayjs.Dayjs,
            dayjs.Dayjs
          ];
          const isDisabled = quarterValue[0].isBefore(quarterValue[1]);
          return getItem(
            quarterOption.name,
            quarterOption.name,
            quarterValue,
            undefined,
            isDisabled
          );
        });

        return getItem(
          DateOption.QuarterToDate,
          DateOption.QuarterToDate,
          undefined,
          quarterItems
        );
      }

      return {
        ...option,
        value: optionValue,
      };
    });

    return allowCustom
      ? options
      : options.filter((option) => option.name !== DateOption.Custom);
  };

  return {
    getDateOptions,
    getOptionValue,
  };
};
