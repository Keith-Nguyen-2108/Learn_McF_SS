import { ref } from "vue";
import { defineStore as definePiniaStore } from "pinia";

import { showNotification } from "@/mixins";

import { Pagination, FilterParams, Sorter } from "@/types";

import useActionCRUD from "./useActionCrud";

export const generateCrudStore = (
  defineStore: typeof definePiniaStore,
  storeName: string,
  apiUrl: string
) => {
  const { get, post, del, put, patch, setQueryString, setFilterString } =
    useActionCRUD();

  const queryObj = ref<Record<string, any>>();
  const filterObj = ref<Record<string, any>>();

  return defineStore({
    id: storeName,
    state: () => {
      return {
        loading: false,
        data: undefined,
        queryString: "",
        filterString: "",
        pagination: { total: 0, current: 1, pageSize: 10 },
        sorter: { order: "", columnKey: "" },
      };
    },
    getters: {
      getPagination: (state) => state.pagination,

      getPaginationString: (state) => {
        return setQueryString(state.pagination);
      },

      getSortersString: (state) => {
        const { order, columnKey } = state.sorter;
        if (columnKey && order) {
          return `sort=${order == "ascend" ? "" : "-"}${columnKey}`;
        } else return "";
      },
    },
    actions: {
      async fetchList(
        customUrl = ""
        // customType?: customQueryType,
        // customObj?: Record<string, any>
      ) {
        this.loading = true;
        let url = customUrl ? customUrl : apiUrl;

        if (!customUrl) {
          let queries = "";
          let filters = "";

          let pagination = this.getPaginationString;
          let sorter = this.getSortersString;

          if (pagination || sorter) {
            queries += pagination + (sorter ? `&${sorter}` : "");
          }

          // if (onlyCustomQuery && !onlyCustomFilter) {
          //   if (Object.keys(customQuery).length > 0)
          //     queries = setQueryString(customQuery);
          // } else if (appendQuery)
          queries += this.queryString ? `&${this.queryString}` : "";

          // if (!onlyCustomQuery && onlyCustomFilter) {
          //   if (Object.keys(customQuery).length > 0)
          //     filters = setFilterString(customQuery);
          // } else if (appendQuery)
          filters = this.filterString;

          if (filters) queries += `&${filters}`;

          if (queries) url += "?" + queries;

          url = url.replace("?&", "?");
        }

        this.data = await get(url);
        this.loading = false;
      },

      async createNewData(customUrl = "", payload = {}) {
        this.loading = true;
        let url: string = customUrl ? customUrl : apiUrl;
        const newData = await post(url, payload);
        if (newData) {
          showNotification("success", "Create successfully");
        }
        this.loading = false;
      },

      async putUpdate(customUrl = "", payload = {}) {
        this.loading = true;
        let url: string = customUrl ? customUrl : apiUrl;
        const newData = await put(url, payload);
        if (newData) {
          showNotification("success", "Update successfully");
        }
        this.loading = false;
      },

      async patchUpdate(customUrl = "", payload = {}) {
        this.loading = true;
        let url: string = customUrl ? customUrl : apiUrl;
        const newData = await patch(url, payload);
        if (newData) {
          showNotification("success", "Update successfully");
        }
        this.loading = false;
      },

      async deleteData(customUrl = "", payload = {}) {
        this.loading = true;
        let url: string = customUrl ? customUrl : apiUrl;
        const data = await del(url, payload);
        if (data) {
          showNotification("success", "Delete successfully");
        }
        this.loading = false;
      },

      setQuery(key: string, value: number | number[] | string | string[]) {
        queryObj.value = { ...queryObj.value, [key]: value };
        this.queryString = setQueryString(queryObj.value);
      },

      deleteQuery(key: string) {
        if (!queryObj.value) return;
        delete queryObj.value[key];
        this.queryString = setQueryString(queryObj.value);
      },

      deleteQueries() {
        queryObj.value = {};
        this.queryString = "";
      },

      setFilter(key: string, value: FilterParams) {
        filterObj.value = { ...filterObj.value, [key]: value };
        this.filterString = setFilterString(filterObj.value);
      },

      deleteFilter(key: string) {
        if (!filterObj.value) return;
        filterObj.value[key] && delete filterObj.value[key];
        this.filterString = setFilterString(filterObj.value);
      },

      deleteFilters() {
        filterObj.value = {};
        this.filterString = "";
      },

      setPagination(payload: Pagination) {
        this.pagination = payload;
      },

      deletePagination() {
        this.pagination = <Pagination>{};
      },

      setSorter(payload: Sorter) {
        const { order, columnKey } = payload;
        this.sorter = { order, columnKey };
      },

      deleteSorter() {
        this.sorter = <Sorter>{};
      },
    },
  });
};
