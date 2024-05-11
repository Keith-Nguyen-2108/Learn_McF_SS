<template>
  <div class="text-input">
    <template v-if="formItem">
      <template v-if="hasWrapperForm">
        <a-form :layout="layout">
          <a-form-item
            :class="[className, { 'text-input__hidden': hidden }]"
            :label="showLabel ? label : undefined"
            :has-feedback="!!props.help"
            :help="$props.help"
            :required="required"
            :validate-status="validateStatus"
            :style="$attrs.style"
          >
            <component
              :is="inputComponent"
              :value="inputValue"
              :class="className"
              :placeholder="placeholder"
              :disabled="disabled"
              :prefix="prefix"
              :maxlength="maxLength"
              @change="onChange"
              @blur="onBlur"
              @focus="onFocus"
              @focusout="onFocusOut"
            >
              <template #suffix>
                <slot name="custom-suffix"></slot>
                {{ suffix }}
              </template>
            </component>
          </a-form-item>
        </a-form>
      </template>

      <template v-else>
        <a-form-item
          :class="[className, { 'text-input__hidden': hidden }]"
          :label="showLabel ? label : undefined"
          :has-feedback="!!props.help"
          :help="$props.help"
          :required="required"
          :validate-status="validateStatus"
          :style="$attrs.style"
        >
          <component
            :is="inputComponent"
            :value="inputValue"
            :class="className"
            :placeholder="placeholder"
            :disabled="disabled"
            :prefix="prefix"
            :maxlength="maxLength"
            @change="onChange"
            @blur="onBlur"
            @focus="onFocus"
            @focusout="onFocusOut"
          >
            <template #suffix>
              <slot name="custom-suffix"></slot>
              {{ suffix }}
            </template>
          </component>
        </a-form-item>
      </template>
    </template>

    <template v-else>
      <label v-if="label && showLabel">{{ label }}</label>

      <component
        :is="inputComponent"
        v-model:value="inputValue"
        :class="className"
        :placeholder="placeholder"
        :disabled="disabled"
        :prefix="prefix"
        :maxlength="maxLength"
        :style="$attrs.style"
        @change="onChange"
        @blur="onBlur"
        @focus="onFocus"
        @focusout="onFocusOut"
      >
        <a-input />
        <template #suffix>
          <slot name="custom-suffix"></slot>
          {{ suffix }}
        </template>
      </component>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { phoneFormat, parserPhone } from "@learnss/utils";

const props = defineProps({
  allowTrim: {
    type: Boolean,
    default: true,
  },
  className: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  formItem: {
    type: Boolean,
    default: false,
  },
  hasWrapperForm: {
    type: Boolean,
    default: true,
  },
  help: {
    type: String,
    default: undefined,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  isPassword: {
    type: Boolean,
    default: false,
  },
  isPhone: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String,
    default: "vertical",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  mask: {
    type: String,
    default: null,
  },
  maxLength: {
    type: Number,
    default: null,
  },
  placeholder: {
    type: String,
    default: "",
  },
  prefix: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  showError: {
    type: Boolean,
    default: true,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  suffix: {
    type: String,
    default: "",
  },
  value: {
    type: [String, Number],
    default: undefined,
  },
});

const emit = defineEmits(["change", "blur", "focus", "focus-out"]);

const inputValue = ref(
  props.isPhone ? phoneFormat(props.value, true) : props.value
);

const inputComponent = props.isPassword ? "a-input-password" : "a-input";
const validateStatus = computed(() => (props.help ? "error" : "validating"));

const format = (val: string | number, preVal?: string | number) => {
  const reg = /^(?!.*[^0-9+]).*?$/;

  let result;

  if (reg.test("" + val)) result = val;
  else {
    if (reg.test("" + preVal)) result = preVal;
  }

  return result;
};

watch(
  () => props.value,
  (newVal) => (inputValue.value = newVal)
);

const onFocus = (e) => {
  if (props.isPhone) inputValue.value = parserPhone(e.target.value);
  else emit("focus");
};

const onFocusOut = (e) => {
  if (props.isPhone) inputValue.value = phoneFormat(e.target.value, true);
  else emit("focus-out");
};

const onChange = (e) => {
  if (!props.isPhone) {
    inputValue.value = e.target.value;
    emit("change", e.target.value);
  } else {
    inputValue.value = format(e.target.value, inputValue.value);
    emit("change", inputValue.value);
  }
};

const onBlur = (e) => {
  if (!props.isPhone) {
    if (props.allowTrim && inputValue.value !== e.target.value.trim()) {
      inputValue.value = e?.target?.trim();
      emit("change", e?.target?.trim());
    }

    emit("blur", inputValue.value);

    return;
  }
  inputValue.value = e.target.value;
  emit("change", parserPhone("" + inputValue.value));
};
</script>

<style lang="scss" scoped>
.text-input {
  & > label {
    line-height: 1.5715;
    margin-bottom: 4px;
    display: block;
  }

  &__hidden {
    margin: 0 !important;
    padding: 0 !important;

    ::v-deep(.ant-form-item-children) {
      display: none;
    }
  }

  .ant-spin-nested-loading {
    ::v-deep(.ant-spin-dot-spin) {
      left: 20px;
    }
  }

  .ant-form-item {
    .ant-form-item-control {
      line-height: unset;
    }
  }

  &__hidden {
    .ant-form-item-children {
      display: none;
    }
  }
}
</style>
