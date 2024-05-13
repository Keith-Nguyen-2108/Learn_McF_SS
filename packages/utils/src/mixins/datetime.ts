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

const defaultConfig: ConfigDatetime = {
  isUTC: false,
  isAddDate: false,
  isShowTime: true,
  formatByTimezone: true,
  formatDateTime: FORMAT_DATE_STR.date,
};

const getCurrTimezone = () => dayjs.tz.guess();

const isValidDatetime = (datetime: DateTime) =>
  dayjs(
    datetime,
    [FORMAT_DATE_STR.dateDashedReverseTime24h, FORMAT_DATE_STR.iso],
    true
  ).isValid();

const parseToUTCByTimezone = (datetime: DateTime, format?: string) =>
  dayjs
    .tz(datetime, getCurrTimezone())
    .utc()
    .format(format || "YYYY-MM-DDTHH:mm:ss.SSS[Z]");

const parseFromUTCByTimezone = (datetime: DateTime, format?: string) =>
  dayjs
    .tz(datetime, getCurrTimezone())
    .format(format || FORMAT_DATE_STR.dateDashedReverseTime24h);

const parseByTimezone = (datetime: DateTime, isUTC: boolean, format?: string) =>
  isUTC
    ? parseToUTCByTimezone(datetime, format)
    : parseFromUTCByTimezone(datetime, format);

export const parseDateTime = (
  datetime: ItemDate,
  config: ConfigDatetime = {}
) => {
  const _config = { ...defaultConfig, ...config };

  if (!datetime || !isValidDatetime(datetime as DateTime)) return;

  if (typeof datetime !== "string") {
    datetime = dayjs(datetime).format(_config.formatDateTime);
  }

  if (_config.isAddDate) {
    const currDate = dayjs().format(FORMAT_DATE_STR.ymdDash);
    datetime = `${currDate} ${dayjs(datetime).format("HH:mm:ss")}.000Z`;
  }

  return _config.formatByTimezone
    ? parseByTimezone(
        datetime as DateTime,
        !!_config.isUTC,
        _config.formatDateTime
      )
    : !_config.isShowTime
    ? dayjs(datetime).format(FORMAT_DATE_STR.date)
    : dayjs(datetime).toISOString();
};
