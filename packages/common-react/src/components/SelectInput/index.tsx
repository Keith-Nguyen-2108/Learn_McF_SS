import React, { useEffect, useRef, useMemo } from "react";
import "./style.scss";

const win = window as any;
const vueApp = win.Vue;
const { createApp } = vueApp;
const { Select } = win.Antd;
const { SelectInput: LearnSSSelectInput } = win.LearnSSStyleGuide;

interface Props {
  allInValue?: boolean;
  allowClear?: boolean;
  className?: string | any[] | Record<string, any>;
  dataSource?: any[];
  defaultActiveFirstOption?: boolean;
  disabled?: boolean;
  endpoint?: string;
  formItem?: boolean;
  label?: string;
  mode?: "default" | "multiple" | "tags";
  optionFirstAll?: Record<string, any> | string | number;
  source?: string;
  sourceLabel?: string | Function;
  value?: string | any[] | Record<string, any>;
}

const SelectInputCmp = ({
  allInValue = false,
  allowClear = false,
  className = "",
  dataSource = [],
  defaultActiveFirstOption = false,
  disabled = false,
  endpoint = "",
  formItem = false,
  label = "",
  mode = "default",
  optionFirstAll,
  source = "",
  sourceLabel = "",
  value = "",
}: Props) => {
  const selectRef = useRef<HTMLDivElement>(null);

  const app = useMemo(() => {
    const vueAppInstance = createApp(LearnSSSelectInput, {
      allInValue,
      allowClear,
      dataSource,
      source,
      sourceLabel,
    });
    vueAppInstance.use(Select);
    return vueAppInstance;
  }, [allInValue, allowClear, dataSource, source, sourceLabel]);

  useEffect(() => {
    if (selectRef.current) {
      app.mount(selectRef.current);
    }
    return () => {
      app.unmount();
    };
  }, [app]);

  return <div ref={selectRef} className={`ss-rc-select ${className}`}></div>;
};

export default SelectInputCmp;
