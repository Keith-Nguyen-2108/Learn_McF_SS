<template>
  <div>{{ listData }}</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { testStore } from "@/store";

const store = testStore();

const listData = computed(() => store.data || []);
</script>
