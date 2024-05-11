export const parserPhone = (newVal: string) => {
  return newVal.replace(/\s/g, "");
};

export const phoneFormat = (
  value: string | number,
  isControl: boolean = false
) => {
  const cleaned = ("" + value).replace(/[^0-9\+\()]/g, "");
  const format = cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  return format ? format : !isControl ? "-" : "";
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeText = (str: string, specificCharacter = " ") => {
  return str
    ?.split(specificCharacter)
    .map(capitalizeFirstLetter)
    .join(specificCharacter);
};
