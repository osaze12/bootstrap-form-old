import React from "react";
import { getProperWord, getSelectOptions } from "../utils";

const SelectBox = ({ props, data, name }: any) => {
  return (
    <select {...props} defaultValue="select">
      <option value="select">Select {getProperWord(name)}</option>
      {getSelectOptions(String(data))?.map((option: any) => {
        return <option value={option.value}>{option.name}</option>;
      })}
    </select>
  );
};

export default SelectBox;
