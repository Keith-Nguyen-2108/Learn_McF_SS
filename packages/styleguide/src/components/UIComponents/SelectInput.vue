<template>
  <template v-if="formItem">
    <a-form :layout="layout">
      <a-form :layout="layout">
        <a-form-item
          :colon="false"
          :class="className"
          :has-feedback="!!help"
          :help="help"
          :required="required"
          :style="$attrs.style"
          :validate-status="validateStatus"
        >
          <template #label>
            <div
              v-if="label"
              class="select-input-label d-flex align-items-center"
            >
              <span class="mr-2">{{ label }}</span>
              <a-tooltip
                v-if="isAutoComplete"
                title="Type to see additional options"
              >
                <info-circle-filled />
              </a-tooltip>
            </div>
          </template>
          <a-select
            v-model:value="inputValue"
            :allow-clear="canAllowClear"
            :class="className"
            :default-active-first-option="defaultActiveFirstOption"
            :disabled="disabled"
            :dropdown-match-select-width="dropdownMatchSelectWidth"
            :dropdown-style="dropdownStyle"
            :filter-option="filterOption"
            :get-popup-container="getPopupContainer"
            :mode="mode"
            :loading="selectLoading"
            :option-filter-prop="optionFilterProp"
            :option-label-prop="optionLabelProp"
            :placeholder="placeholder"
            :show-search="showSearch"
            :size="size"
            :style="$attrs.style"
            @change="onChange"
            @search="onSearch"
            @select="onSelect"
          >
            <a-select-option
              v-for="option in options"
              :key="getLowerCaseValue(option[source])"
              :value="getLowerCaseValue(option[source])"
              :disabled="option.disabled || selectLoading"
              :label="generateLabel(option)"
              :title="hasOptionTooltip ? generateLabel(option) : null"
            >
              <slot name="option" :option="option">
                {{ generateLabel(option) }}
              </slot>
            </a-select-option>
            <template #notFoundContent>
              <div class="text-center">
                <img :src="imgEmptySrc" class="empty-image" />
                <p>No data</p>
              </div>
            </template>
          </a-select>
        </a-form-item>
      </a-form>
    </a-form>
  </template>

  <template v-else>
    <div class="select-input">
      <label v-if="label">
        <div class="select-input-label d-flex align-items-center">
          <span class="mr-2">{{ label }}</span>
          <a-tooltip
            v-if="isAutoComplete"
            title="Type to see additional options"
          >
            <info-circle-filled />
          </a-tooltip>
        </div>
      </label>
      <a-select
        v-model:value="inputValue"
        :allow-clear="canAllowClear"
        :class="className"
        :default-active-first-option="defaultActiveFirstOption"
        :disabled="disabled"
        :dropdown-match-select-width="dropdownMatchSelectWidth"
        :dropdown-style="dropdownStyle"
        :filter-option="filterOption"
        :get-popup-container="getPopupContainer"
        :loading="selectLoading"
        :mode="mode"
        :option-filter-prop="optionFilterProp"
        :option-label-prop="optionLabelProp"
        :placeholder="placeholder"
        :show-search="showSearch"
        :size="size"
        :style="$attrs.style"
        @change="onChange"
        @search="onSearch"
        @select="onSelect"
      >
        <a-select-option
          v-for="option in options"
          :key="getLowerCaseValue(option[source])"
          :value="getLowerCaseValue(option[source])"
          :disabled="option.disabled || selectLoading"
          :label="generateLabel(option)"
          :title="hasOptionTooltip ? generateLabel(option) : null"
        >
          <slot name="option" :option="option">
            {{ generateLabel(option) }}
          </slot>
        </a-select-option>

        <template #notFoundContent>
          <div class="text-center">
            <img :src="imgEmptySrc" class="empty-image" />
            <p>No data</p>
          </div>
        </template>
      </a-select>
    </div>
  </template>
</template>

<script setup lang="ts">
import { PropType, computed, onBeforeMount, ref, toRaw, watch } from "vue";

import { FilterOperators, AdvancedFilterValue } from "@learnss/utils";
import { useStore } from "@/store";
import {
  debounce,
  differenceBy,
  isEmpty,
  isEqual,
  isNil,
  pullAllBy,
} from "lodash";

type Query = [string, any];
type Filter = [string, AdvancedFilterValue];

type ConfigParseOption = {
  source?: string;
  sourceLabel?: string;
  optionFirstAll?: Record<string, any>;
};
type ParseOptions = (options: any[], config?: ConfigParseOption) => any[];
type TypeSelect = "default" | "autocomplete";
type OptionItem = {
  source?: any;
  disabled?: boolean;
};

const props = defineProps({
  allInValue: {
    type: Boolean,
    default: false,
  },
  allowClear: {
    type: Boolean,
    default: false,
  },
  className: {
    type: [String, Array, Object],
    default: undefined,
  },
  dataSource: {
    type: Array as PropType<any[]>,
    default: undefined,
  },
  defaultActiveFirstOption: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dropdownMatchSelectWidth: {
    type: Boolean,
    default: true,
  },
  dropdownStyle: {
    type: Object,
    default: () => ({}),
  },
  /**
   * Not use this to support multiple select when they have dependencies relationship
   */
  endpoint: {
    type: String,
    default: null,
  },
  filterOperators: {
    type: String as PropType<FilterOperators>,
    default: FilterOperators.FILTERS_EQUAL,
  },
  filtersParam: {
    type: Array as PropType<Filter[]>,
    default: null,
  },
  formItem: {
    type: Boolean,
    default: false,
  },
  getPopupContainer: {
    type: Function,
    default: (ele: Element) => ele.parentNode,
  },
  hasOptionTooltip: {
    type: Boolean,
    default: true,
  },
  help: {
    type: String,
    default: undefined,
  },
  // using for waiting for a condition to call endpoint
  isWaiting: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String,
    default: "vertical",
  },
  label: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String as PropType<"default" | "multiple" | "tags">,
    default: "default",
  },
  optionFilterProp: {
    type: String,
    default: "label",
  },
  // for use or unused the All option in list option
  optionFirstAll: {
    type: Object as PropType<Record<string, any> | string | number>,
    default: undefined,
  },
  // render as content of select option. Ant-Select prop
  optionLabelProp: {
    type: String,
    default: "label",
  },
  parseOptions: {
    type: Function as PropType<ParseOptions>,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: "",
  },
  queriesParam: {
    type: Array as PropType<Query[]>,
    default: null,
  },
  required: {
    type: Boolean,
    default: false,
  },
  searchKey: {
    type: String,
    default: null,
  },
  searchType: {
    type: String,
    default: null,
    validator: (value: string) => ["query", "filter"].indexOf(value) != -1,
  },
  size: {
    type: String as PropType<"small" | "default" | "large">,
    default: "default",
    validator: (value: string) => ["small", "default", "large"].includes(value),
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  source: {
    type: String,
    required: true,
  },
  sourceLabel: {
    type: [String, Function],
    default: "",
  },
  type: {
    type: String as PropType<TypeSelect>,
    default: "default",
  },
  value: {
    type: [Number, String, Array],
    default: undefined,
  },
});

const emit = defineEmits(["change", "search"]);

// <================== STORE ===================>

const selectStore = useStore(props.label, props.endpoint);

const data = computed<any[]>(() => selectStore.data as any[]);
const queryString = computed(() => selectStore.queryString);
const filterString = computed(() => selectStore.filterString);

const getLowerCaseValue = (value) => {
  if (value && typeof value == "string") return value.toLowerCase();

  if (Array.isArray(value) && value?.length) {
    if (typeof value[0] == "string")
      return value.map((itemVal: string) => itemVal.toLowerCase());
    else if (typeof value[0] == "number") return value;
    else
      return value.map(
        (itemVal: Record<string, any>) =>
          (itemVal = {
            ...itemVal,
            [props.source]:
              typeof itemVal[props.source] == "number"
                ? itemVal[props.source]
                : ("" + itemVal[props.source])?.toLowerCase(),
          })
      );
  }

  return value;
};

/**
 * IMPORTANT: NOT SET LOADING for loading attribute of select component
 * it will make onSearch function run duplicate but the second will run with empty value
 */
const selectLoading = computed(
  () => props.loading || selectStore.loading || false
);

const filterOption = props.searchKey ? false : true;
const isAutoComplete = computed<boolean>(() => props.type === "autocomplete");
const isModeMultiple = computed<boolean>(() => props.mode === "multiple");

/**
 * @var tempApiUrl
 * this variable will keep the previous api URL
 * to compare with the latest URL to stop actions that call multiple the same api
 */
const tempApiUrl = ref("");

const imgEmptySrc =
  "https://s3.ap-southeast-2.amazonaws.com/sscrm.dev.data/crm-empty.png";

/**
 * We have 2 types of search keywords typing keyword and search keyword.
 * ----------------------------------------------------------------------
 * Typing keyword is the keyword that always changes when user types in select input to search a option.
 * We will call API to re-fetch new list following typing keyword.
 * ----------------------------------------------------------------------
 * Search keyword is the label of the currently selected option.
 * When user selects an option, we get the label of this selection and assign it to search keyword value,
 * and we will call api to re-fetch a new list option following the value of search keyword
 */
const typingKeyword = ref<string>("");
const searchKeyword = ref<string>("");
const inputValue = ref<any>(getLowerCaseValue(props.value));

/**
 * If use prop optionFirstAll, component will generate a All option or return option All that you gave
 * ATTENTION: your All option object must have at least 2 key are [props.source] and [props.sourceLabel]
 */
const optionAll = computed(() => {
  if (typeof props.optionFirstAll != "object") return undefined;

  if (Object.keys(props.optionFirstAll)?.length < 2) {
    console.error(
      "Your All option object must have at least 2 key are [props.source] and [props.sourceLabel]",
      props.label
    );
    return undefined;
  } else return props.optionFirstAll;
});

/**
 * ATTENTION: Every item in list option must be a object and have at least 2 keys
 */
const options = computed<OptionItem[]>(() => {
  if (props.parseOptions) {
    const _configParseOptions = {
      source: props.source,
      sourceLabel:
        typeof props.sourceLabel === "string"
          ? props.sourceLabel
          : props.source,
      optionFirstAll: optionAll.value || undefined,
    };
    return props.parseOptions(
      toRaw(props.endpoint ? (data.value as any[]) : props.dataSource),
      _configParseOptions
    );
  }
  if (props.endpoint)
    return optionAll.value && data
      ? [optionAll.value, ...data.value]
      : data.value;

  return optionAll.value
    ? [optionAll.value, ...props.dataSource]
    : props.dataSource;
});

const validateStatus = computed(() => (props.help ? "error" : "validating"));

const canAllowClear = computed(() =>
  optionAll.value
    ? props.allowClear && optionAll.value[props.source] != props.value
    : props.allowClear
);

const generateLabel = (option) => {
  if (!props.sourceLabel) return option[props.source];
  if (typeof props.sourceLabel == "string") return option[props.sourceLabel];

  return props.sourceLabel(option);
};

const validateMultipleValue = () => {
  if (!options.value) return;
  const map = new Map(options.value.map((obj) => [obj[props.source], obj]));

  let temp = true;

  if (props.value) {
    for (let value of props.value as any[]) {
      if (!map.has(value)) {
        temp = false;
        return;
      }
    }
  }
  return temp;
};

const isValidValue = computed(() => {
  if (isModeMultiple.value) {
    return validateMultipleValue();
  } else {
    return options.value.find(
      (option) =>
        getLowerCaseValue(option[props.source]) ==
        getLowerCaseValue(props.value)
    );
  }
});

/**
 * Because we will lowercase all values passed into select input.
 * So, if we want to get the origin value
 * maybe it is uppercase, or capitalized, or anything,...
 * we will get it from the list options and emit them to the parent.
 */

const getOriginalValue = (value: any) => {
  if (!options.value?.length) return value;

  if (Array.isArray(value)) {
    let matches = value.map((itemVal: any) => {
      return options.value.find(
        (option: any) => getLowerCaseValue(option[props.source]) == itemVal
      );
    });

    matches = matches.map(
      (matchItem: Record<string, any>) => matchItem[props.source]
    );

    return matches;
  } else {
    const tempValue = options.value.find(
      (option: Record<string, any>) =>
        getLowerCaseValue(option[props.source]) == value
    );

    return tempValue && Object.keys(tempValue).length
      ? tempValue[props.source]
      : value;
  }
};

watch(
  () => props.value,
  (newVal) => {
    inputValue.value = getLowerCaseValue(newVal);
  }
);

watch(options, (newVal) => {
  /**
   * If the received value weren't included in the list option,
   * we would reset the select value
   */
  if (!isValidValue.value) inputValue.value = isModeMultiple.value ? [] : "";

  /**
   * @var props.defaultActiveFirstOption true
   * @var props.value null | undefined | empty
   * @var option.value.length true
   */
  if (props.defaultActiveFirstOption) {
    _setDefaultFirstOption();
    return;
  }

  if (isModeMultiple.value) {
    const diffs = differenceBy(newVal, inputValue.value, props.source);

    if (diffs.length) {
      inputValue.value = pullAllBy(inputValue.value, diffs, props.source);
    }
    return;
  }

  const foundValue = newVal.find(
    (item) =>
      getLowerCaseValue(item[props.source]) ==
      getLowerCaseValue(inputValue.value)
  );

  if (!foundValue) {
    inputValue.value = undefined;
    onChange(inputValue.value);
  }
});

watch(
  () => props.isWaiting,
  async (newVal) => {
    if (!newVal && props.endpoint) await getData();
  }
);

// <================== FILTERS & QUERIES ===================>

const handleUrl = () => {
  const hasQueryOrFilter = queryString.value || filterString.value;

  let url = `${props.endpoint}${hasQueryOrFilter ? "?" : ""}`;

  if (queryString.value) url += `${queryString.value}`;

  if (filterString.value)
    url += `${queryString.value ? "&" : ""}${filterString.value}`;

  return url;
};

const apiUrl = computed(() => handleUrl() || props.endpoint);

const getData = async () => {
  try {
    if (!tempApiUrl.value) {
      tempApiUrl.value = apiUrl.value;
      await selectStore.fetchList(apiUrl.value);
    } else {
      if (tempApiUrl.value && tempApiUrl.value != apiUrl.value) {
        tempApiUrl.value = apiUrl.value;
        await selectStore.fetchList(apiUrl.value);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const isFiltersLoaded = computed(() =>
  props.filtersParam
    ? props.filtersParam.every((filter) => filter[1].value)
    : true
);

const hasValFiltersNull = computed(() =>
  props.filtersParam
    ? props.filtersParam.some((filter: Filter) => isNil(filter[1].value))
    : false
);

// <================== FILTERS ===================>

/**
 * Executes only with props.filters
 * setAdvancedFilter using Map.property.set().
 * So it shouldn't a synchronous.
 * It need await to convert to synchronous function.
 */
const _setFilters = (filters?: Filter[]) => {
  const _tempFilters = filters && filters.length ? filters : props.filtersParam;
  if (isFiltersLoaded.value && _tempFilters?.length) {
    _tempFilters.forEach(([keys, value]) => selectStore.setFilter(keys, value));
  }
};

watch(isFiltersLoaded, async () => await _setFilters());

watch(
  () => props.filtersParam,
  async (newFilter, oldFilter) => {
    const hasFilterChanged =
      newFilter.length !== oldFilter?.length ||
      newFilter.some(
        (initiator, index) => !isEqual(initiator, oldFilter[index])
      );
    selectStore.deleteFilters();
    await _setFilters();
    !props.isWaiting && hasFilterChanged && (await getData());
  }
);

// <================== QUERIES ===================>

const isQueriesLoaded = computed(() =>
  props.queriesParam ? props.queriesParam.every((query) => query[1]) : true
);

const hasValQueriesNull = computed(() =>
  props.queriesParam
    ? props.queriesParam.some((query) => isNil(query[1]))
    : false
);

// Executes only with props.queries
const _setQueries = (queries?: Query[]) => {
  const _tempQueries = queries && queries.length ? queries : props.queriesParam;
  if (isQueriesLoaded.value && _tempQueries?.length) {
    _tempQueries.forEach(([key, value]) => selectStore.setQuery(key, value));
  }
};

watch(isQueriesLoaded, async () => await _setQueries());

watch(
  () => props.queriesParam,
  async (newQueries, oldQueries) => {
    const hasQueriesChanged =
      newQueries.length !== oldQueries?.length ||
      newQueries.some(
        (initiator, index) => !isEqual(initiator, oldQueries[index])
      );
    selectStore.deleteQueries();
    await _setQueries();
    !props.isWaiting && hasQueriesChanged && (await getData());
  }
);

const setEndPointParams = (newVal: string | number = undefined) => {
  if (!props.searchKey) return;

  const newSearchTerm = newVal || searchKeyword.value;

  switch (props.searchType) {
    case "filter":
      newSearchTerm
        ? _setFilters([
            [
              props.searchKey,
              {
                operator: props.filterOperators,
                value: newSearchTerm?.toString(),
              },
            ],
          ])
        : selectStore.deleteFilter(props.searchKey);
      break;

    default:
      newSearchTerm
        ? _setQueries([[props.searchKey, newSearchTerm?.toString()]])
        : selectStore.deleteQuery(props.searchKey);
      break;
  }
};

// <================== EVENTS ===================>

const getAllInValue = (value: any) => {
  if (isModeMultiple.value) {
    const fullValMultiple = value.map((item) => {
      const matchedItem = options.value.find(
        (option) =>
          getLowerCaseValue(option[props.source]) == getLowerCaseValue(item)
      );
      return toRaw(matchedItem);
    });
    return fullValMultiple;
  }

  const fullValue = options.value.find(
    (item) => getLowerCaseValue(item[props.source]) == getLowerCaseValue(value)
  );
  return fullValue;
};

/** @function onChange
 * @param value : if the value is falsy or the mode of select is MULTIPLE, we will handle it here.
 * Included case user select the option All - falsy value
 * If the value is truthy, we handle it in onSelect function
 * ATTENTION: when you click into the clear icon, will run into event onChange
 */
const onChange = async (value: any) => {
  if (
    (!isModeMultiple.value && value) ||
    (!filterOption && typingKeyword.value)
  )
    return;

  searchKeyword.value = "";

  /** Action click into the clear icon, the value will be empty array
   *  so we will call the api to get the data
   */
  if (isNil(value) || (isModeMultiple.value && !value.length)) {
    if (props.endpoint && props.allowClear) {
      props.searchType === "filter"
        ? selectStore.deleteFilter(props.searchKey)
        : selectStore.deleteQuery(props.searchKey);
      await getData();
    }
    inputValue.value = isModeMultiple.value ? [] : value;
  }

  const tempVal = getOriginalValue(value);

  const result = props.allInValue ? getAllInValue(tempVal) : tempVal;
  emit("change", result);
};

/** @function onSearch
 * Event blur will run into event search - so we will handle it in once function onSearch to prevent duplicate api calls
 * ---------------------------------------------------------------------------------------
 * Event blur - when user click outside the select === Event search - user clear the typing keyword
 *  we will re-fetch the previous list option follow the search keyword
 * ---------------------------------------------------------------------------------------
 * Event search:
 *  we will always call api to fetch the new list option follow the typing keyword
 *   1. if user clear the typing keyword we will re-fetch the previous list option follow the search keyword - like Event blur
 *   2. if user click button Clear or user selected the All option we will clear typing and search keyword
 */
const onSearch = debounce(async (value: string) => {
  typingKeyword.value = value;

  if (!props.endpoint) {
    emit("search", value);
    return;
  }

  if (!props.searchKey) return;

  if (!value) setEndPointParams(searchKeyword.value || "");
  else setEndPointParams(value);

  if (hasValFiltersNull.value) return;
  if (hasValQueriesNull.value) return;

  await getData();
}, 500);

/** @function onSelect
 * @param value : if the value is truthy and the mode of select is not MULTIPLE mode, we will handle it here.
 * Not handle case user select the option All - falsy value here.
 * If the value is falsy, we handle it in onChange function
 *
 * We can't handle mode MULTIPLE here because action select just accepts the single value,
 * and the array value will be handled in onChange function
 */
const onSelect = async (value: any) => {
  if (!value || isModeMultiple.value) {
    searchKeyword.value = "";
    return;
  }

  inputValue.value =
    typeof value == "string" ? getLowerCaseValue(value) : value;

  searchKeyword.value = typingKeyword.value;
  typingKeyword.value = ""; // After user selected a option, we will reset the typing keyword

  const tempVal = getOriginalValue(value);

  const result = props.allInValue ? getAllInValue(tempVal) : tempVal;
  emit("change", result);
};

const isFiltersAndQueryLoaded = computed(
  () => isFiltersLoaded.value && isQueriesLoaded.value
);

const _onMountedFetchOptions = async () => {
  const _isAllowFetch =
    props.endpoint && isFiltersAndQueryLoaded.value && !props.isWaiting;

  if (!_isAllowFetch) return;

  !props.isWaiting && (await getData());
};

watch(isFiltersAndQueryLoaded, _onMountedFetchOptions);

const _setDefaultFirstOption = () => {
  if (!props.defaultActiveFirstOption) return;

  if ((isNil(props.value) || isEmpty(props.value)) && options.value?.length) {
    const firstOption = getLowerCaseValue(options.value[0][props.source]);
    inputValue.value = isModeMultiple.value ? [firstOption] : firstOption;
    if (!inputValue.value) onChange(inputValue.value);
    else onSelect(inputValue.value);
  }
};

onBeforeMount(async () => {
  /** Should set await for the _setFilters and _setQueries.
   * Because function setAdvancedFilter using method map.property.set() to update value.
   * It can a Promise
   */
  await _setFilters();
  _setQueries();
  await _onMountedFetchOptions();
  _setDefaultFirstOption();
});
</script>

<style lang="scss" scoped>
.ant-form-item-control-wrapper {
  width: 100% !important;
}

.ant-select {
  width: 100%;
}

::v-deep() {
  .empty-image {
    width: 100%;
    height: 60px;
    object-fit: contain;
  }
  .ant-form-item-required {
    display: flex;
    align-items: center;
  }
}
.select-input-label {
  a-tooltip {
    display: flex;
  }
}
</style>
