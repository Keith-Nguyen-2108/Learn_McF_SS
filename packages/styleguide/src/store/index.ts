import { defineStore } from "pinia";
import { generateCrudStore } from "@learnss/utils";

export const useStore = (storeName: string, endpoint: string) =>
  generateCrudStore(defineStore, storeName, endpoint)();
