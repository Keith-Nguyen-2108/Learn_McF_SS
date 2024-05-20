import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { T_FormatDateStr, T_ItemDate } from "@/types";
import { C_FORMAT_DATE_STR } from "@/constants";

dayjs.extend(utc);
dayjs.extend(tz);

type T_DateTime =
  | T_FormatDateStr["dateDashedReverseTime24h"]
  | T_FormatDateStr["iso"];

type T_ConfigDatetime = {
  isUTC?: boolean;
  isAddDate?: boolean;
  isShowTime?: boolean;
  formatByTimezone?: boolean;
  formatDateTime?: T_FormatDateStr[keyof T_FormatDateStr];
};

const defaultConfig: T_ConfigDatetime = {
  isUTC: false,
  isAddDate: false,
  isShowTime: true,
  formatByTimezone: true,
  formatDateTime: C_FORMAT_DATE_STR.date,
};

const getCurrTimezone = () => dayjs.tz.guess();

const isValidDatetime = (datetime: T_DateTime) =>
  dayjs(
    datetime,
    [C_FORMAT_DATE_STR.dateDashedReverseTime24h, C_FORMAT_DATE_STR.iso],
    true
  ).isValid();

const parseToUTCByTimezone = (datetime: T_DateTime, format?: string) =>
  dayjs
    .tz(datetime, getCurrTimezone())
    .utc()
    .format(format || "YYYY-MM-DDTHH:mm:ss.SSS[Z]");

const parseFromUTCByTimezone = (datetime: T_DateTime, format?: string) =>
  dayjs
    .tz(datetime, getCurrTimezone())
    .format(format || C_FORMAT_DATE_STR.dateDashedReverseTime24h);

const parseByTimezone = (
  datetime: T_DateTime,
  isUTC: boolean,
  format?: string
) =>
  isUTC
    ? parseToUTCByTimezone(datetime, format)
    : parseFromUTCByTimezone(datetime, format);

export const parseDateTime = (
  datetime: T_ItemDate,
  config: T_ConfigDatetime = {}
) => {
  const _config = { ...defaultConfig, ...config };

  if (!datetime || !isValidDatetime(datetime as T_DateTime)) return;

  if (typeof datetime !== "string") {
    datetime = dayjs(datetime).format(_config.formatDateTime);
  }

  if (_config.isAddDate) {
    const currDate = dayjs().format(C_FORMAT_DATE_STR.ymdDash);
    datetime = `${currDate} ${dayjs(datetime).format("HH:mm:ss")}.000Z`;
  }

  return _config.formatByTimezone
    ? parseByTimezone(
        datetime as T_DateTime,
        !!_config.isUTC,
        _config.formatDateTime
      )
    : !_config.isShowTime
    ? dayjs(datetime).format(C_FORMAT_DATE_STR.date)
    : dayjs(datetime).toISOString();
};
