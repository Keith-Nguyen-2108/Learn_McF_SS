import { VueElement } from "vue";
import { ItemType } from "ant-design-vue";
import dayjs, { OpUnitType, ManipulateType } from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

import { T_ItemDate } from "@learnss/utils";

import {
  C_DATE_OPTIONS,
  E_DateOption,
  C_QUARTER_OPTIONS,
  E_QuarterOrder,
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

  const getOptionValue = (
    option: E_DateOption | E_QuarterOrder
  ): T_ItemDate[] => {
    const startOf = (unit: OpUnitType) => dayjs().startOf(unit);
    const endOf = (unit: OpUnitType) => dayjs().endOf(unit);
    const subtract = (amount: number, unit: ManipulateType) =>
      dayjs().subtract(amount, unit);

    switch (option) {
      case E_DateOption.ThisMonth:
        return [startOf("month"), endOf("month")];
      case E_DateOption.ThisWeek:
        return [startOf("week"), endOf("week")];
      case E_DateOption.Today:
        return [dayjs(), dayjs()];
      case E_DateOption.Yesterday:
        return [subtract(1, "days"), subtract(1, "days")];
      case E_DateOption.LastWeek:
        return [
          subtract(1, "weeks").startOf("week"),
          subtract(1, "weeks").endOf("week"),
        ];
      case E_DateOption.Last7Days:
        return [subtract(7, "days"), dayjs()];
      case E_DateOption.Last30Days:
        return [subtract(30, "days"), dayjs()];
      case E_DateOption.Last90Days:
        return [subtract(90, "days"), dayjs()];
      case E_DateOption.LastMonth:
        return [
          subtract(1, "months").startOf("month"),
          subtract(1, "months").endOf("month"),
        ];
      case E_DateOption.Last3Months:
        return [
          subtract(3, "months").startOf("month"),
          subtract(1, "months").endOf("month"),
        ];
      case E_DateOption.LastYear:
        return [
          subtract(1, "years").startOf("year"),
          subtract(1, "years").endOf("year"),
        ];
      case E_DateOption.WeekToDate:
        return [startOf("week"), dayjs()];
      case E_DateOption.MonthToDate:
        return [startOf("month"), dayjs()];
      case E_QuarterOrder.FirstQuarter:
        return [dayjs().quarter(1).startOf("quarter"), dayjs()];
      case E_QuarterOrder.SecondQuarter:
        return [dayjs().quarter(2).startOf("quarter"), dayjs()];
      case E_QuarterOrder.ThirdQuarter:
        return [dayjs().quarter(3).startOf("quarter"), dayjs()];
      case E_QuarterOrder.LastQuarter:
        return [dayjs().quarter(4).startOf("quarter"), dayjs()];
      case E_DateOption.YearToDate:
        return [startOf("year"), dayjs()];
    }
  };

  const getDateOptions = (newOptions?: any, allowCustom = false) => {
    const options = (newOptions || C_DATE_OPTIONS).map((option) => {
      const optionValue = getOptionValue(option.name) as [
        dayjs.Dayjs,
        dayjs.Dayjs
      ];

      if (option.name === E_DateOption.QuarterToDate) {
        const quarterItems = C_QUARTER_OPTIONS.map((quarterOption) => {
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
          E_DateOption.QuarterToDate,
          E_DateOption.QuarterToDate,
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
      : options.filter((option) => option.name !== E_DateOption.Custom);
  };

  return {
    getDateOptions,
    getOptionValue,
  };
};
