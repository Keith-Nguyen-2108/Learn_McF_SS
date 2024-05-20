import { create } from "zustand";

import {
  useActionCRUD,
  T_Pagination,
  T_FilterParams,
  T_Sorter,
} from "@learnss/utils";

type State = {
  loading: boolean;
  data: any;
  error: any;
  queryString?: string;
  filterString?: string;
  pagination?: T_Pagination;
  sorter?: Record<keyof T_Sorter, any>;
};

type Action = {
  fetchList: (customUrl?: string) => Promise<void>;
  createNewData: (
    payload: Record<string, any>,
    customUrl?: string
  ) => Promise<void>;
  putUpdateData: (
    payload: Record<string, any>,
    customUrl?: string
  ) => Promise<void>;
  patchUpdateData: (
    payload: Record<string, any>,
    customUrl?: string
  ) => Promise<void>;
  deleteData: (
    payload: Record<string, any>,
    customUrl?: string
  ) => Promise<void>;
  setQuery: (key: string, value: number | number[] | string | string[]) => void;
  deleteQuery: (key: string) => void;
  deleteQueries: () => void;
  setFilter: (key: string, value: T_FilterParams) => void;
  deleteFilter: (key: string) => void;
  deleteFilters: () => void;
  setPagination: (payload: T_Pagination) => void;
  deletePagination: () => void;
  setSorter: (payload: T_Sorter) => void;
  deleteSorter: () => void;
};

export const useStore = (apiUrl: string) => {
  const { get, post, del, put, patch, setQueryString, setFilterString } =
    useActionCRUD();

  let queryObj: Record<string, any> = {};
  let filterObj: Record<string, any> = {};

  const buildUrlWithQueries = () => {
    const { pagination, sorter, queryString, filterString } =
      tempStore.getState();
    const paginationString = setQueryString(pagination);
    const sorterString =
      sorter.columnKey && sorter.order
        ? `sort=${sorter.order === "ascend" ? "" : "-"}${sorter.columnKey}`
        : "";
    let queries = [paginationString, sorterString, queryString]
      .filter(Boolean)
      .join("&");
    if (filterString) queries += `&${filterString}`;
    return `${apiUrl}?${queries.replace("?&", "?")}`;
  };

  const handleDataFetch = async (method, payload, customUrl, set) => {
    set((state) => ({
      ...state,
      loading: true,
    }));

    const url = customUrl || method == "get" ? buildUrlWithQueries() : apiUrl;
    try {
      const response = await { get, post, put, patch, del }[method](
        url,
        payload
      );
      set((state) => ({ ...state, data: response }));
    } catch (error) {
      set((state) => ({ ...state, error }));
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  };

  const tempStore = create<State & Action>((set) => ({
    loading: false,
    data: undefined,
    error: undefined,
    queryString: "",
    filterString: "",
    pagination: { total: 0, current: 1, pageSize: 10 },
    sorter: { order: "", columnKey: "" },

    fetchList: async (customUrl?: string) =>
      await handleDataFetch("get", {}, customUrl, set),

    createNewData: async (payload: Record<string, any>, customUrl?: string) =>
      await handleDataFetch("post", payload, customUrl, set),
    putUpdateData: async (payload: Record<string, any>, customUrl?: string) =>
      await handleDataFetch("put", payload, customUrl, set),
    patchUpdateData: async (payload: Record<string, any>, customUrl?: string) =>
      await handleDataFetch("patch", payload, customUrl, set),
    deleteData: async (payload: Record<string, any>, customUrl?: string) =>
      await handleDataFetch("delete", payload, customUrl, set),
    setQuery: (key: string, value: number | number[] | string | string[]) => {
      queryObj = { ...queryObj, [key]: value };
      set((state) => ({
        ...state,
        queryString: setQueryString(queryObj),
      }));
    },
    deleteQuery: (key: string) => {
      if (!Object.keys(queryObj).length) return;
      queryObj[key] && delete queryObj[key];
      set((state) => ({
        ...state,
        queryString: setQueryString(queryObj),
      }));
    },
    deleteQueries: () => {
      queryObj = {};
      set((state) => ({
        ...state,
        queryString: "",
      }));
    },
    setFilter: (key: string, value: T_FilterParams) => {
      filterObj = { ...filterObj, [key]: value };
      set((state) => ({
        ...state,
        filterString: setFilterString(filterObj),
      }));
    },
    deleteFilter: (key: string) => {
      if (!Object.keys(filterObj).length) return;
      filterObj[key] && delete filterObj[key];
      set((state) => ({
        ...state,
        filterString: setFilterString(filterObj),
      }));
    },
    deleteFilters: () => {
      filterObj = {};
      set((state) => ({
        ...state,
        filterString: "",
      }));
    },
    setPagination: (payload: T_Pagination) => {
      set((state) => ({
        ...state,
        pagination: payload,
      }));
    },
    deletePagination: () => {
      set((state) => ({
        ...state,
        pagination: <T_Pagination>{},
      }));
    },
    setSorter(payload: T_Sorter) {
      const { order, columnKey } = payload;
      set((state) => ({
        ...state,
        sorter: { order, columnKey },
      }));
    },
    deleteSorter: () => {
      set((state) => ({
        ...state,
        sorter: <T_Sorter>{},
      }));
    },
  }));
  return tempStore;
};
