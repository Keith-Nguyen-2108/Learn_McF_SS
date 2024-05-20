import dayjs from "dayjs";

export type T_FormatDateStr = {
  fullDateTime12h: "dddd, DD/MM/YYYY, hh:mm A";
  date: "DD/MM/YYYY";
  dateAbbr: "DD/MM/YYYY z";
  datetime: "DD/MM/YYYY hh:mm A";
  datetimeHasSeconds: "DD/MM/YYYY hh:mm:ss A";
  datetimeAbbr: "DD/MM/YYYY hh:mm A z";
  dateDashedReverseTime24h: "YYYY-MM-DD HH:mm:ss";
  dateMonth: "DD MMMM";
  dateWeek: "ddd, DD MMM";
  iso: "YYYY-MM-DDTHH:mm:ssZ";
  isoUTC: "YYYY-MM-DDTHH:mm:ss+0000";
  time12h: "hh:mm A";
  time24h: "HH:mm:ss";
  dm: "DD/MM";
  mdDash: "MM-DD";
  ymdDash: "YYYY-MM-DD";
};

export type T_ItemDate = dayjs.Dayjs | Date | string | undefined;
