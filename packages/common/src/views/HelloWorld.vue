<template>
  <div class="cf-navbar">
    <div class="component-item">
      <SelectInput
        label="Select Input"
        default-active-first-option
        :data-source="listUsers"
        :loading="loading"
        source="id"
        source-label="name"
        @change="onUserChange"
      />
    </div>

    <div class="component-item">
      <DaterangeFilter label="Daterange Filter" @change="onChangeDateRange" />
    </div>

    <div class="component-item">
      <TextareaInput
        label="Textarea Input"
        :limit-count="20"
        @change="onChangeTextArea"
      />
    </div>

    <div class="component-item">
      <DatePicker label="Date Picker" @change="onChangeDate" />
    </div>

    <!-- <div class="mt-3">
      <TestStore />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import {
  DatePicker,
  DaterangeFilter,
  SelectInput,
  TextareaInput,
} from "@learnss/styleguide";

import { testStore } from "@/store";
import TestStore from "./TestStore.vue";

const userStore = testStore();

const listUsers = computed(() => userStore.data || []);
const loading = computed(() => userStore.loading);

onBeforeMount(async () => {
  await userStore.fetchList();
});

const onUserChange = (value: any) => {
  console.log("onUserChange", value);
};

const onChangeDateRange = (objVal: Record<string, any>) => {
  console.log("onChangeDateRange", objVal);
};

const onChangeTextArea = (value) => {
  console.log("onChangeTextArea", value);
};

const onChangeDate = (value) => {
  console.log("onChangeDate", value);
};
</script>

<style scoped lang="scss">
.cf-navbar {
  width: 100%;
  .component-item {
    width: 300px;
  }
}
</style>
