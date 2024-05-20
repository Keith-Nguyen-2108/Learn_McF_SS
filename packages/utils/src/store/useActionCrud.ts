import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import {
  showErrorNotification,
  generateQueryString,
  generateFilterString,
} from "@/mixins";

export const useActionCRUD = () => {
  const makeRequest = async (
    method: Method,
    url: string,
    payload?: Record<string, any>
  ) => {
    try {
      const config: AxiosRequestConfig = {
        method: method,
        url: url,
        ...(payload && { data: payload }),
      };
      const response = await axios(config);
      return response.data.results ?? response.data;
    } catch (error) {
      showErrorNotification(error as AxiosError);
    }
  };

  const get = (url: string) => makeRequest("get", url);
  const post = (url: string, payload: Record<string, any>) =>
    makeRequest("post", url, payload);
  const put = (url: string, payload: Record<string, any>) =>
    makeRequest("put", url, payload);
  const patch = (url: string, payload: Record<string, any>) =>
    makeRequest("patch", url, payload);
  const del = (url: string, payload: Record<string, any>) =>
    makeRequest("delete", url, payload);

  const setQueryString = (queryParameters: Record<string, any>) =>
    generateQueryString(queryParameters);

  const setFilterString = (filterParameters: Record<string, any>) =>
    generateFilterString(filterParameters);

  return {
    post,
    del,
    get,
    put,
    patch,
    setQueryString,
    setFilterString,
  };
};
