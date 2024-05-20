import { defineRule } from "vee-validate";
import AllRules from "@vee-validate/rules";

import { C_EMAIL_PATTERN } from "@/constants";

Object.keys(AllRules).forEach((rule) => {
  defineRule(
    rule as keyof typeof AllRules,
    AllRules[rule as keyof typeof AllRules]
  );
});

defineRule("required", (value: string, _: any, ctx: Record<string, any>) => {
  if (!value || !value.length) {
    return `${ctx.label} is required`;
  }
  return true;
});

defineRule("max", (value: string, _: any, ctx: Record<string, any>) => {
  const maxLen = +ctx.rule.params[0];
  if (value && value.length > maxLen) {
    return `${ctx.label} must be less than ${maxLen} characters`;
  }
  return true;
});

defineRule("min", (value: string, _: any, ctx: Record<string, any>) => {
  const minLen = +ctx.rule.params[0];
  if (value && value.length < minLen) {
    return `${ctx.label} must be more than ${minLen} characters`;
  }
  return true;
});

defineRule("email", (value: any) => {
  if (!value) return true;

  if (Array.isArray(value)) {
    return value.every((val) => C_EMAIL_PATTERN.test(String(val)));
  }

  return C_EMAIL_PATTERN.test(String(value));
});

defineRule("phone_number", (value: any, params: any, ctx: any) => {
  if (!value) return true;

  const isExistPlusCharacter = "" + value.includes("+");

  const maxLength = isExistPlusCharacter ? 16 : 15;
  const minLength = isExistPlusCharacter ? 10 : 9;

  const count = value.match(/\+/g);

  if (
    (isExistPlusCharacter && value.indexOf("+") !== 0) ||
    (count && count.length !== 1)
  ) {
    return `The ${ctx.field} field must be a valid phone number`;
  }

  if (value.length > maxLength || value.length < minLength) {
    return `The ${ctx.field} field characters must be greater than ${minLength} and less than ${maxLength}`;
  }

  return true;
});
