import axios, { AxiosError } from "axios";
import {
  showErrorNotification,
  generateQueryString,
  generateFilterString,
} from "@/mixins";

const useActionCRUD = () => {
  const get = async (url: string) => {
    try {
      const res = await axios.get(url);
      if (res && res.data) return res.data.results ?? res.data;
    } catch (err) {
      showErrorNotification(err as AxiosError);
    }
  };

  const post = async (url: string, payload: Record<string, any>) => {
    try {
      const res = await axios.post(url, payload);
      if (res && res.data) {
        return res.data.results ?? res.data;
      }
    } catch (err) {
      showErrorNotification(err as AxiosError);
    }
  };

  const put = async (url: string, payload: Record<string, any>) => {
    try {
      const res = await axios.put(url, payload);
      if (res && res.data) {
        return res.data.results ?? res.data;
      }
    } catch (err) {
      showErrorNotification(err as AxiosError);
    }
  };

  const patch = async (url: string, payload: Record<string, any>) => {
    try {
      const res = await axios.patch(url, payload);
      if (res && res.data) {
        return res.data.results ?? res.data;
      }
    } catch (err) {
      showErrorNotification(err as AxiosError);
    }
  };

  const del = async (url: string, payload: Record<string, any>) => {
    try {
      const res = await axios.delete(url, payload);
      if (res && res.data) {
        return res.data.results ?? res.data;
      }
    } catch (err) {
      showErrorNotification(err as AxiosError);
    }
  };

  const setQueryString = (queryParameters: Record<string, any>) => {
    return generateQueryString(queryParameters);
  };

  const setFilterString = (filterParameters: Record<string, any>) => {
    return generateFilterString(filterParameters);
  };

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

export default useActionCRUD;
