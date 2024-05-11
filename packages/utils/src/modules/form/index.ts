import { Ref } from "vue";
import { useField, useForm } from "vee-validate";
import { omit } from "lodash";

import "./rules";

type ValidateFunction = (val: any) => string | boolean;

type FieldValue = {
  label?: string;
  rules?: string | ValidateFunction | Record<string, any>;
};

type FieldsValuesType = {
  value: Ref<string>;
  errorMessage: Ref<string>;
  handleChange: (e: Event | any) => void;
};

const useFormValidation = <T extends Record<string, any>>(
  objFields: Record<keyof T, FieldValue>
) => {
  const {
    errors,
    meta,
    values,
    handleSubmit,
    setFieldError,
    setFieldValue,
    validateField,
    resetForm,
  } = useForm();

  const fields = Object.entries(objFields).reduce((_fields, [name, option]) => {
    const { value, errorMessage, handleChange } = useField(
      name,
      (option as FieldValue)?.rules,
      omit(option as object, "rules")
    );

    return {
      ..._fields,
      [name]: {
        value,
        errorMessage,
        handleChange(e: any) {
          handleChange(e);
        },
      },
    };
  }, {}) as Record<keyof T, FieldsValuesType>;

  const setErrors = (fields: Partial<Record<keyof T, string>>) => {
    Object.entries(fields).forEach(([field, errorMessage]) => {
      setFieldError(field as keyof T, errorMessage as string);
    });
  };

  const setValues = (values: Partial<T>) => {
    Object.entries(values).forEach(([key, value]) => {
      setFieldValue(key as keyof T, value as T[keyof T]);
    });
  };

  return {
    errors,
    fields,
    meta,
    values,
    handleSubmit,
    setErrors,
    setValues,
    validateField,
    resetForm,
  };
};
export default useFormValidation;
