import { useEffect, useState } from "react";

import { SelectInputCmp } from "@learnss/react-utils";

import { userStore } from "@/store";

export default function Root(props) {
  const fetchList = userStore((state) => state.fetchList) as any;
  const data = userStore((state) => state.data);

  const [listData, setDataSource] = useState([]);

  useEffect(() => {
    (async () => {
      await fetchList();
    })();
  }, []);

  useEffect(() => {
    if (data && data.length) setDataSource(data);
  }, [data]);

  return (
    <SelectInputCmp dataSource={listData} source="id" sourceLabel="name" />
  );
}
