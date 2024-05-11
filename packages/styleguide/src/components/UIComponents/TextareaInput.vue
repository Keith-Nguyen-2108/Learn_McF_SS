<template>
  <div :class="['textarea-input', { 'resize-none': !allowResize }]">
    <template v-if="formItem">
      <a-form :layout="layout">
        <a-form-item
          :class="className"
          :label="showLabel ? label : undefined"
          :has-feedback="hasFeedback"
          :help="$props.help"
          :required="required"
          :validate-status="validateStatus"
        >
          <template #label>
            <slot name="label">{{ label }}</slot>
          </template>

          <a-textarea
            v-model:value="inputValue"
            :auto-size="autoSize"
            :disabled="disabled"
            :maxlength="maxLength"
            :placeholder="!disabled ? placeholder : ''"
            :rows="rows"
            :show-count="showCount"
            @change="onChange"
            @blur="onBlur"
          />

          <div
            v-if="limitCount && limitCount > 0"
            :class="[
              'counter-line text-end sub-h8',
              countTotalMessage > 1 ? 'error-6--text' : 'neutral-7--text',
            ]"
          >
            <slot
              name="countContent"
              :lengthOfUtf8="countLengthOfUTF8"
              :totalMessage="countTotalMessage"
              :limitCount="limitCount"
            >
              {{ countLengthOfUTF8 }}/{{ limitCount }}
              <span
                v-if="countTotalMessage > 1 && customErrorMessage"
                class="mr-1"
              >
                {{ ` (${countTotalMessage} ${customErrorMessage})` }}
              </span>
            </slot>
          </div>
        </a-form-item>
      </a-form>
    </template>

    <template v-else>
      <label v-if="label && showLabel">
        <slot name="label">{{ label }}</slot>
      </label>

      <a-textarea
        v-model:value="inputValue"
        :class="[
          className,
          ('' + inputValue).length > limitCount ? 'over-limit' : '',
        ]"
        :auto-size="autoSize"
        :disabled="disabled"
        :maxlength="maxLength"
        :placeholder="!disabled ? placeholder : ''"
        :rows="rows"
        :show-count="showCount"
        @change="onChange"
      />

      <div
        v-if="limitCount && limitCount > 0"
        :class="[
          'counter-line text-end sub-h8',
          countTotalMessage > 1 ? 'error-6--text' : 'neutral-7--text',
        ]"
      >
        <slot
          name="countContent"
          :lengthOfUtf8="countLengthOfUTF8"
          :totalMessage="countTotalMessage"
          :limitCount="limitCount"
        >
          {{ countLengthOfUTF8 }}/{{ limitCount }}
          <span v-if="countTotalMessage > 1 && customErrorMessage" class="mr-1">
            {{ ` (${countTotalMessage} ${customErrorMessage})` }}
          </span>
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";

interface AutoSize {
  minRows?: number;
  maxRows?: number;
}

const props = defineProps({
  autoSize: {
    type: [Boolean, Object] as PropType<boolean | AutoSize>,
    default: false,
  },
  className: {
    type: String,
    default: "",
  },
  customErrorMessage: {
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
  help: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  layout: {
    type: String,
    default: "vertical",
  },
  maxLength: {
    type: Number,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 4,
  },
  rules: {
    type: [Object, String],
    default: "",
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  value: {
    type: [String, Number],
    default: "",
  },
  allowTrim: {
    type: Boolean,
    default: true,
  },
  showCount: {
    type: Boolean,
    default: false,
  },
  limitCount: {
    type: Number,
    default: undefined,
  },
  allowResize: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["change"]);

const inputValue = ref(props.value);

const hasFeedback = computed(() => !!props.help);
const validateStatus = computed(() => (props.help ? "error" : "validating"));
const countLengthOfUTF8 = computed(
  () => new TextEncoder().encode(inputValue.value?.toString()).length
);
const countTotalMessage = computed(() =>
  Math.ceil(countLengthOfUTF8.value / parseInt(props.limitCount?.toString()))
);

watch(
  () => props.value,
  (newVal: string | number) => {
    inputValue.value = newVal;
  }
);

const typingCount = ref<number>(0);

const onChange = ({ target: { value } }) => {
  inputValue.value = value;

  if (props.limitCount && +props.limitCount > 0) {
    typingCount.value = value.length;
  }
  emit("change", value);
};

const onBlur = ({ target: { value } }) => {
  if (props.allowTrim && inputValue.value !== value.trim()) {
    inputValue.value = value.trim();
    emit("change", value.trim());
  }
};
</script>

<style lang="scss" scoped>
.textarea-input {
  & > label {
    line-height: 1.5715;
    margin-bottom: 4px;
    display: block;
  }

  &.hidden-field {
    padding: 0 !important;

    ::v-deep(input) {
      opacity: 0;
    }
  }

  .ant-form-item {
    &-control {
      &.has-error {
        .ant-form-item-children {
          display: block;
        }
      }
    }
  }

  .counter-line {
    top: 20px;
  }

  &.resize-none textarea {
    resize: none;
  }

  .ant-input,
  .ant-input:focus,
  .ant-input:hover {
    &.over-limit {
      border-color: red;
    }
  }
}
</style>
