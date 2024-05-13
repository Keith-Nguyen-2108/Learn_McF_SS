import { SelectInputCmp } from "@/components";

export default function Root(props) {
  const data = [
    { id: 1, name: "a" },
    { id: 2, name: "b" },
    { id: 3, name: "c" },
    { id: 4, name: "d" },
  ];

  return <SelectInputCmp dataSource={data} source="id" sourceLabel="name" />;
}
