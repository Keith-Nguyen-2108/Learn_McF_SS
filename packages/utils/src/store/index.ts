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

  const buildUrlWithQueries = (
    endpoint: string,
    pagination,
    getSortersString,
    queryString,
    filterString
  ) => {
    let url = endpoint;
    let queries = [pagination, getSortersString, queryString]
      .filter(Boolean)
      .join("&");
    let filters = filterString;

    if (filters) queries += `&${filters}`;
    if (queries) url += `?${queries.replace("?&", "?")}`;

    return url;
  };

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

      getPaginationString: (state) => setQueryString(state.pagination),

      getSortersString: (state) => {
        const { order, columnKey } = state.sorter;
        return columnKey && order
          ? `sort=${order === "ascend" ? "" : "-"}${columnKey}`
          : "";
      },
    },
    actions: {
      async fetchList(customUrl = "") {
        this.loading = true;
        try {
          const url = !customUrl
            ? buildUrlWithQueries(
                apiUrl,
                this.getPaginationString,
                this.getSortersString,
                this.queryString,
                this.filterString
              )
            : customUrl;
          this.data = await get(url);
        } catch (error) {
          showNotification("error", "Failed to fetch data");
        } finally {
          this.loading = false;
        }
      },

      async createNewData(customUrl = "", payload = {}) {
        this.loading = true;
        const url: string = customUrl || apiUrl;
        try {
          const newData = await post(url, payload);
          if (newData) {
            showNotification("success", "Create successfully");
          }
        } catch (error) {
          showNotification("error", "Failed to create data");
        } finally {
          this.loading = false;
        }
      },

      async putUpdate(customUrl = "", payload = {}) {
        this.loading = true;
        const url: string = customUrl || apiUrl;
        try {
          const newData = await put(url, payload);
          if (newData) {
            showNotification("success", "Update successfully");
          }
        } catch (error) {
          showNotification("error", "Failed to update data");
        } finally {
          this.loading = false;
        }
      },

      async patchUpdate(customUrl = "", payload = {}) {
        this.loading = true;
        const url: string = customUrl || apiUrl;
        try {
          const newData = await patch(url, payload);
          if (newData) {
            showNotification("success", "Update successfully");
          }
        } catch (error) {
          showNotification("error", "Failed to update data");
        } finally {
          this.loading = false;
        }
      },

      async deleteData(customUrl = "", payload = {}) {
        this.loading = true;

        const url: string = customUrl || apiUrl;
        try {
          const newData = await del(url, payload);
          if (newData) {
            showNotification("success", "Delete successfully");
          }
        } catch (error) {
          showNotification("error", "Failed to delete data");
        } finally {
          this.loading = false;
        }
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
