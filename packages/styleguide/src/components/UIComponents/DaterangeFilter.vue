<template>
  <label v-if="label">{{ label }}</label>
  <div class="date-range-filter" @click="onFilterClick">
    <a-range-picker
      v-click-away="onCancel"
      :allow-clear="allowClear"
      :get-calendar-container="(trigger) => trigger.parentNode"
      :open="isPickerOpen"
      :format="formatDate"
      :value="currentPeriod"
      :disabled-date="disabledDate"
      @change="onChange"
    >
      <template #suffixIcon>
        <calendar-outlined />
      </template>

      <template #renderExtraFooter>
        <div class="date-range-filter__preset-list">
          <div
            v-for="opt in options"
            :key="opt.name"
            :class="[
              'date-range-filter__preset-option',
              'gray-9--text',
              opt.name === selectedOption ? 'h7 primary-1--bg' : 'b7',
              opt.label == DateOption.QuarterToDate ? 'p-0' : 'active',
            ]"
            @click="onOptionClick(opt)"
          >
            <template v-if="opt.label == DateOption.QuarterToDate">
              <a-menu
                v-model:selectedKeys="state.selectedKeys"
                mode="inline"
                :open-keys="state.openKeys"
                :items="[opt]"
                @openChange="onOpenChange"
                @click="onOptionClick"
              ></a-menu>
            </template>
            <template v-else>
              <div>
                {{ opt.name }}
              </div></template
            >
          </div>
        </div>

        <a-row type="flex" justify="end">
          <a-col>
            <a-space>
              <a-button size="small" @click="onCancel"> Cancel </a-button>

              <a-button
                size="small"
                type="primary"
                class="me-2"
                @click="onApply"
              >
                Apply
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </template>
    </a-range-picker>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import _ from "lodash";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import VueClickAway from "vue3-click-away";

import { FORMAT_DATE_STR } from "@learnss/utils";
import { useCustomDateRangePicker } from "@/modules";
import { DateOption, QUARTER_OPTIONS, QuarterOrder } from "@/constants";

type CustomDateOption = {
  name: DateOption | QuarterOrder;
  value: [string, string] | [Dayjs, Dayjs];
  label?: string;
  key?: string;
  item?: Record<string, any>;
  disabled?: boolean;
};

const app = getCurrentInstance();

app.appContext.app.use(VueClickAway);

const props = defineProps({
  allowClear: {
    type: Boolean,
    default: true,
  },
  allowOptionCustom: {
    type: Boolean,
    default: false,
  },
  disabledDate: {
    type: Function,
    default: () => false,
  },
  formatDate: {
    type: String,
    default: FORMAT_DATE_STR.date,
  },
  label: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["change"]);

const state = reactive({
  rootSubmenuKeys: ["Quarter to date"],
  openKeys: [],
  selectedKeys: [],
});

const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey = openKeys.find(
    (key) => state.openKeys.indexOf(key) === -1
  );
  if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    state.openKeys = openKeys;
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : [];
  }
};

const currentPeriod = ref<dayjs.Dayjs[]>([dayjs().startOf("month"), dayjs()]);

const { getDateOptions } = useCustomDateRangePicker();

const options = ref<CustomDateOption[]>(
  getDateOptions(undefined, props.allowOptionCustom)
);

const selectedOption = ref<DateOption>(DateOption.MonthToDate);
const tempOption = ref(selectedOption.value);
const tempPeriod = ref(currentPeriod.value);

const onChange = (val: dayjs.Dayjs[], event?: any) => {
  currentPeriod.value = val;
  selectedOption.value = DateOption.Custom;
  console.log("onChange", val, event);
};

const onOptionClick = (option: CustomDateOption) => {
  if (
    option.name == DateOption.Custom ||
    option.name == DateOption.QuarterToDate ||
    option.key == DateOption.QuarterToDate
  )
    return;

  const isQuarterOption = QUARTER_OPTIONS.find((opt) => opt.name == option.key);

  if (isQuarterOption) {
    const { item } = option;
    const { originItemValue } = item;
    currentPeriod.value = originItemValue.value as dayjs.Dayjs[];
    selectedOption.value = originItemValue.key as any;
  } else {
    currentPeriod.value = option.value as dayjs.Dayjs[];
    selectedOption.value = option.name as any;
    state.selectedKeys = state.openKeys = [];
  }
};

const isPickerOpen = ref(false);

const onFilterClick = (event?: any) => {
  if (event?.target?.innerText === "Apply") return;
  tempOption.value = selectedOption.value;
  isPickerOpen.value = true;
};

const handleCancel = () => {
  currentPeriod.value = tempPeriod.value;
  selectedOption.value = tempOption.value;
  state.selectedKeys = state.openKeys = [];
  isPickerOpen.value = false;
};

const onCancel = (event: any) => {
  console.log("onCancel", event);

  const isCustomOption =
    Object.values(DateOption).includes(event?.target?.innerText) ||
    Object.values(QuarterOrder).includes(event?.target?.innerText);

  const isCalenderItem = event?.target?.className?.includes("ant-calendar");

  if (isCalenderItem || isCustomOption) return;

  handleCancel();
};

const onApply = (event?: any) => {
  const conditionPeriod = (period) => period.toISOString();
  const newCurrentPeriod = currentPeriod.value?.map(conditionPeriod);

  emit("change", {
    currentPeriod: newCurrentPeriod,
  });

  tempPeriod.value = currentPeriod.value;

  isPickerOpen.value = false;

  event && event.stopPropagation();
};

onMounted(() => onApply());
</script>

<style lang="scss">
.date-range-filter {
  .ant-picker-range {
    width: 100%;

    .ant-picker-range-separator {
      .anticon-swap-right > svg {
        margin-top: -10px !important;
      }
    }
  }
}

.ant-picker-dropdown-range {
  .ant-picker {
    &-panel-container {
      width: 772px;
    }

    &-panels {
      margin-left: 212px;
      width: 72% !important;
    }

    &-footer {
      border: 1px solid rgba(5, 5, 5, 0.06);

      &-extra {
        width: 100%;
        padding: 4px;
      }
    }

    &-dropdown .ant-picker-panel {
      border: none;
    }
  }

  .date-range-filter {
    &__preset-list {
      position: absolute;
      top: 0;
      left: 0;
      width: 28%;
      height: 280px;
      overflow: auto;
      padding: 8px 0;
    }

    &__preset-option {
      cursor: pointer;
      padding: 8px 12px;
      line-height: 1.5;

      .ant-menu > .ant-menu-item:hover,
      .ant-menu > .ant-menu-submenu:hover,
      .ant-menu > .ant-menu-item-active,
      .ant-menu > .ant-menu-submenu-active,
      .ant-menu > .ant-menu-item-open,
      .ant-menu > .ant-menu-submenu-open,
      .ant-menu > .ant-menu-item-selected,
      .ant-menu > .ant-menu-submenu-selected {
        background: #ffffff !important;
        background-color: #ffffff !important;
      }

      .ant-menu-light {
        &.ant-menu-inline .ant-menu-sub.ant-menu-inline {
          background: #ffffff !important;
        }
        .ant-menu-submenu-selected > .ant-menu-submenu-title {
          color: #000;
          font-size: $h7;
          font-weight: 700;
        }
        &.ant-menu-root.ant-menu-inline {
          border-inline-end: none;

          .ant-menu {
            &-title-content {
              padding-left: 12px;
              border-radius: 0px;
            }
          }

          .ant-menu-submenu {
            border-radius: 0px;

            &-selected {
              .ant-menu-submenu {
                &-title {
                  padding: 0px !important;
                  margin: 0px;
                  width: 100%;
                  &:hover {
                    background: $primary-1 !important;
                    border-radius: 0px;
                  }
                }
              }
            }

            &:not(.ant-menu-submenu-selected) {
              .ant-menu-submenu-title {
                padding: 0px !important;
                margin: 0px;
                width: 100%;
                &:hover {
                  background: #fff !important;
                  border-radius: 0px;
                }
              }
            }

            &.ant-menu-submenu-inline.ant-menu-submenu-selected {
              &:not(.ant-menu-submenu-open) {
                background: $primary-1 !important;
              }
            }

            &-arrow {
              inset-inline-end: 45px;
            }
          }

          .ant-menu-item {
            line-height: 40px !important;
            margin-block: 0px;
            padding-left: 15px !important;
            &-selected {
              color: #000;
              background: $primary-1 !important;
              font-size: $h7;
              font-weight: 700;
              border-radius: 0px;
              margin: 0px;
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
