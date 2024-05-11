import { defineStore } from "pinia";
import { generateCrudStore } from "@learnss/utils";

export const useStore = (storeName: string, endpoint: string) =>
  generateCrudStore(defineStore, storeName, endpoint)();

export const testStore = () =>
  useStore("user", "https://jsonplaceholder.typicode.com/users");
