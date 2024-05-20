import { useStore } from "@learnss/react-utils";

export const userStore: any = useStore(
  "https://jsonplaceholder.typicode.com/users"
);
