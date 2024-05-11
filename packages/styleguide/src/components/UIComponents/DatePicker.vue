<template>
  <div
    class="date-picker-input"
    :class="disabled ? 'disabled' : ''"
    @change="onChange"
  >
    <template v-if="formItem">
      <a-form :layout="layout">
        <a-form-item
          :class="className"
          :help="$props.help"
          :label="label"
          :label-align="labelAlign"
          :label-col="labelCol"
          :required="required"
          :validate-status="validateStatus"
        >
          <a-date-picker
            v-model:value="inputValue"
            :allow-clear="allowClear"
            :disabled="disabled"
            :disabled-date="disabledDate"
            :disabled-time="disabledTime"
            :dropdown-class-name="dropdownClassName"
            :placeholder="placeholder"
            :placement="placement"
            :format="format"
            :show-time="showTime"
            :mode="mode"
            :open="open"
            :value-format="valueFormat"
            :get-calendar-container="(trigger) => trigger.parentNode"
            @change="onDateChange"
            @openChange="onOpenChange"
            @panelChange="onPanelChange"
            @ok="onOk"
          />
        </a-form-item>
      </a-form>
    </template>

    <template v-else>
      <label v-if="label">{{ label }}</label>

      <a-date-picker
        v-model:value="inputValue"
        :allow-clear="allowClear"
        :disabled="disabled"
        :disabled-date="disabledDate"
        :disabled-time="disabledTime"
        :dropdown-class-name="dropdownClassName"
        :placeholder="placeholder"
        :placement="placement"
        :format="format"
        :show-time="showTime"
        :mode="mode"
        :open="open"
        :value-format="valueFormat"
        :get-calendar-container="(trigger) => trigger.parentNode"
        @change="onDateChange"
        @openChange="onOpenChange"
        @panelChange="onPanelChange"
        @ok="onOk"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import dayjs from "dayjs";

import {
  getDatetimeAbbr,
  FORMAT_DATE_STR,
  parseDateTime,
} from "@learnss/utils";

type LabelAlign = "left" | "right";

const props = defineProps({
  allowClear: {
    type: Boolean,
    default: true,
  },
  className: {
    type: [String, Object],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledDate: {
    type: Function,
    default: () => {},
  },
  disabledTime: {
    type: Function,
    default: () => {},
  },
  dropdownClassName: {
    type: String,
    default: undefined,
  },
  formatDate: {
    type: String,
    default: FORMAT_DATE_STR.date,
  },
  formItem: {
    type: Boolean,
    default: false,
  },
  hasFormatDateAbbr: {
    type: Boolean,
    default: false,
  },
  help: {
    type: String,
    default: undefined,
  },
  isFormatTimezone: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  labelAlign: {
    type: String as PropType<LabelAlign>,
    default: undefined,
  },
  labelCol: {
    type: Object,
    default: undefined,
  },
  layout: {
    type: String,
    default: "vertical",
  },
  placeholder: {
    type: String,
    default: "",
  },
  placement: {
    type: String,
    default: "bottomLeft",
  },
  required: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: [String, Object],
    default: "",
  },
  showTime: {
    type: [Boolean, Object],
    default: false,
  },
  value: {
    type: [Object, String],
    default: null,
  },
  valueFormat: {
    type: String,
    default: undefined,
  },
  yearOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["change", "ok"]);

const textFormatAbbr = ref<string>("");
const mode = ref(props.yearOnly ? "year" : "date");
const open = ref(false);

const convertValue = (value) => {
  if (!value) {
    mode.value = props.yearOnly ? "year" : "date";
    return undefined;
  }
  if (props.hasFormatDateAbbr) textFormatAbbr.value = getDatetimeAbbr(value);

  // parse a datetime from UTC to a datetime in the specified timezone.
  if (props.isFormatTimezone) {
    return parseDateTime(value);
  }

  return value;
};

const inputValue = ref(convertValue(props.value));

const format = computed(
  () =>
    props.formatDate +
    `${props.hasFormatDateAbbr ? " [" + textFormatAbbr.value + "]" : ""}`
);
const validateStatus = computed(() => (props.help ? "error" : "validating"));

watch(
  () => props.value,
  (newVal) => (inputValue.value = convertValue(newVal))
);

const getValueFormat = () => {
  if (props.valueFormat) return props.valueFormat;
  if (props.yearOnly) return "YYYY";

  return props.showTime
    ? FORMAT_DATE_STR.dateDashedReverseTime24h
    : FORMAT_DATE_STR.ymdDash;
};

const onDateChange = (value) => {
  if (!value) {
    emit("change", undefined);
    return;
  }

  if (props.isFormatTimezone) {
    // parse the datetime to UTC using the specified timezone.
    emit("change", parseDateTime(value, { isUTC: true }));

    return;
  }

  emit("change", dayjs(value).format(getValueFormat()));
};

const onOpenChange = (status) => (open.value = status);

const onPanelChange = (value, modeChange) => {
  if (!props.yearOnly) {
    mode.value = modeChange;
    return;
  }
  onDateChange(value);
  open.value = false;
};

const onOk = () => emit("ok");

const onChange = (event: any) => {
  event.stopImmediatePropagation();
};
</script>
<style lang="scss" scoped>
.date-picker-input {
  .ant-picker {
    width: 100%;
  }

  &.disabled {
    ::v-deep() {
      .anticon {
        display: none;
      }
    }
  }

  .ant-form-item-control {
    line-height: unset;

    &.has-error {
      .ant-picker:hover
        ::v-deep(.ant-calendar-picker-input:not(.ant-input-disabled)) {
        border-color: $error-6;
      }
    }
  }
}
</style>
