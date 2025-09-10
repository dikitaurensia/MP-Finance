import React from "react";
import { Input } from "antd";
import { formatCurrency } from "./constanta";
import { REGEX_CURRENCY } from "./constanta";

export function Currency({
  placeholder,
  name,
  suffix,
  value,
  onChange,
  defaultValue,
  onBlur,
  ...props
}) {
  function onHandleChange(e) {
    let { value } = e.target;
    let data = value.replace(/,/g, "");
    const reg = REGEX_CURRENCY;
    let data1 = data;
    if (data.charAt(data.length - 1) === ".") {
      data1 = `${data}0`;
    }

    if ((!isNaN(data1) && reg.test(data1)) || data1 === "" || data1 === "-") {
      onChange({
        target: { name: e.target.name, value: data },
      });
    }
  }

  function onHandleBlur(e) {
    let { value } = e.target;
    let data = value.replace(/,/g, "");
    const reg = REGEX_CURRENCY;
    let data1 = data;
    if (data.charAt(data.length - 1) === ".") {
      data1 = `${data}0`;
    }

    if ((!isNaN(data1) && reg.test(data1)) || data1 === "" || data1 === "-") {
      onBlur({
        target: { name: e.target.name, value: data },
      });
    }
  }

  return (
    <Input
      {...props}
      onChange={onHandleChange}
      onBlur={onBlur ? onHandleBlur : null}
      placeholder={placeholder}
      name={name}
      defaultValue={formatCurrency(value)}
      value={formatCurrency(value)}
      suffix={suffix}

    // type="number"
    //   style={{ textAlign: "right" }}
    />
  );
}

export default Currency;
