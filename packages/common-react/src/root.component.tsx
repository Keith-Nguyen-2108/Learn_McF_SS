import { useEffect, useState } from "react";

import { SelectInputCmp } from "@learnss/react-utils";

import { useUser } from "@/store";

export default function Root(props) {
  const { fetchUser, listUser } = useUser();

  useEffect(() => {
    (async () => {
      await fetchUser();
    })();
  }, []);

  return (
    <SelectInputCmp
      label="User List"
      dataSource={listUser}
      source="id"
      sourceLabel="name"
    />
  );
}
