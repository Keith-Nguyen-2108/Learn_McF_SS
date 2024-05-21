import { useStore } from "@learnss/react-utils";

import { useMemo } from "react";

import { IUser } from "../models";
import { ENDPOINT } from "../infras";

interface IUserStore {
  listUser: IUser[];
  error: string;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

export const useUser = (): IUserStore => {
  const userStore = useMemo(() => useStore(ENDPOINT), []);

  const listUser = userStore((state) => state.data);
  const error = userStore((state) => state.error);
  const loading = userStore((state) => state.loading);

  const fetchList = userStore((state) => state.fetchList);

  const fetchUser = async () => await fetchList();

  return { listUser, error, loading, fetchUser };
};
