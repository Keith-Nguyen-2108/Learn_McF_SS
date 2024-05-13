// Anything exported from this file is importable by other in-browser modules.
import { Select } from "ant-design-vue";

import "./styles/style.scss";

const win = window as any;

win.Antd = {
  Select,
};

export * from "./store";
export * from "./components";
export * from "./constants";
