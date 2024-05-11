import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { FormatDateStr, ItemDate } from "@/types";
import { FORMAT_DATE_STR } from "@/constants";

dayjs.extend(utc);
dayjs.extend(tz);

type DateTime =
  | FormatDateStr["dateDashedReverseTime24h"]
  | FormatDateStr["iso"];

type ConfigDatetime = {
  isUTC?: boolean;
  isAddDate?: boolean;
  isShowTime?: boolean;
  formatByTimezone?: boolean;
  formatDateTime?: FormatDateStr[keyof FormatDateStr];
};

const defaultConfig = {
  isUTC: false,
  isAddDate: false,
  isShowTime: true,
  formatByTimezone: true,
  formatDateTime: FORMAT_DATE_STR.date,
};

export const getCurrTimezone = () => {
  return dayjs.tz.guess();
};

export const getDateTimeAbbr = (datetime: ItemDate) => {
  return dayjs
    .tz(datetime, getCurrTimezone())
    .format(FORMAT_DATE_STR.datetimeAbbr);
};

export const isValidDatetime = (datetime: DateTime) => {
  return dayjs(
    datetime,
    [FORMAT_DATE_STR.dateDashedReverseTime24h, FORMAT_DATE_STR.iso],
    true
  ).isValid();
};

export const _parseTime12hTo24h = (
  time12h: string,
  formatTimeStr: FormatDateStr[keyof FormatDateStr] = FORMAT_DATE_STR.time24h
) => {
  return dayjs(dayjs().format(FORMAT_DATE_STR.ymdDash) + " " + time12h).format(
    formatTimeStr
  );
};

const parseToUTCByTimezone = (datetime: DateTime, format?: string) => {
  const timeWithoutZ = datetime.endsWith("Z")
    ? datetime.slice(0, -1)
    : datetime;
  const mtzByTimezone = dayjs.tz(timeWithoutZ, getCurrTimezone());

  return format
    ? mtzByTimezone.utc().format(format)
    : mtzByTimezone.utc().toISOString();
};

const parseFromUTCByTimezone = (datetime: DateTime, format?: string) => {
  return dayjs
    .tz(datetime, getCurrTimezone())
    .format(format || FORMAT_DATE_STR.dateDashedReverseTime24h);
};

export const parseByTimezone = (
  datetime: DateTime,
  isUTC: boolean,
  format?: string
) => {
  return isUTC
    ? parseToUTCByTimezone(datetime, format)
    : parseFromUTCByTimezone(datetime, format);
};

export const parseDateTime = (
  datetime: ItemDate,
  config: ConfigDatetime = {}
) => {
  const _config = { ...defaultConfig, ...config };

  if (!datetime || !isValidDatetime(datetime as DateTime)) {
    return undefined;
  }

  if (typeof datetime !== "string") {
    datetime = dayjs(datetime).format(_config.formatDateTime);
  }

  if (_config.isAddDate) {
    const currDate = dayjs().format(FORMAT_DATE_STR.ymdDash);
    datetime = currDate + " " + _parseTime12hTo24h(datetime) + ".000Z";
  }

  return _config.formatByTimezone
    ? parseByTimezone(
        datetime as DateTime,
        _config.isUTC,
        _config.formatDateTime
      )
    : !_config.isShowTime
    ? dayjs(datetime).format(FORMAT_DATE_STR.date)
    : dayjs(datetime).toISOString();
};
