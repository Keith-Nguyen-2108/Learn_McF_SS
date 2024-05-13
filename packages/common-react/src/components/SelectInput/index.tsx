import React, { useEffect, useRef } from "react";

import "./style.scss";

const win = window as any;
const vueApp = win.Vue;
const { createApp } = vueApp;
const { Select } = win.Antd;
const { SelectInput: LearnSSSelectInput } = win.LearnSSStyleGuide;

interface Props {
  allInValue: boolean;
  allowClear: boolean;
  className: string | any[] | Record<string, any>;
  dataSource: any[];
  defaultActiveFirstOption: boolean;
  disabled: boolean;
  endpoint: string;
  formItem: boolean;
  label: string;
  mode: "default" | "multiple" | "tags";
  optionFirstAll: Record<string, any> | string | number;
  // queriesParam: any[]
  source: string;
  sourceLabel: string | Function;
  value: string | any[] | Record<string, any>;
}

const SelectInputProps: Props = {
  allInValue: false,
  allowClear: false,
  className: "",
  dataSource: [],
  defaultActiveFirstOption: false,
  disabled: false,
  endpoint: "",
  formItem: false,
  label: "",
  mode: "default",
  optionFirstAll: undefined,
  source: "",
  sourceLabel: "",
  value: "",
};

const SelectInputCmp = (props: Props) => {
  const { allInValue, allowClear, source, sourceLabel, dataSource } = props;

  let app = null;

  const selectRef = useRef();

  useEffect(() => {
    console.log("vueApp", vueApp);
    console.log("selectRef", selectRef.current);
    console.log("SelectInput", LearnSSSelectInput);

    app = createApp(LearnSSSelectInput, {
      allInValue,
      allowClear,
      dataSource,
      source,
      sourceLabel,
    });
    console.log("selectRef abc", selectRef.current);

    app.use(Select);
    app.mount(selectRef.current);
  }, []);

  return <div ref={selectRef} className="ss-rc-select"></div>;
};

SelectInputCmp.defaultProps = SelectInputProps;

export default SelectInputCmp;
