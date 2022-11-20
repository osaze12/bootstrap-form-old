import React, { useEffect, useState } from "react";
import Visibility from "./components/Visibility";
import SelectBox from "./components/SelectBox";
import {
  buttonWordRegex,
  getProperWord,
  getPropValues,
  hasVisibilityRegex,
  passedValidation,
  removeUnnecessaryData,
  selectWordRegex,
  validInputTypwWordRegex,
} from "./utils";

type Props = {
  fields: Object;
  preloadData?: Object;
  payload?: (res: Function, success: Function, error: Function) => any;
};

export default function BootstrapedForm({
  fields,
  preloadData,
  payload,
}: Props) {
  const [state, setState] = useState<string[]>([]);
  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [getErrorKeyNamesForReference, setStoreErrorKeyNamesForReference] =
    useState<any>({});
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const getFieldsKeys = Object.keys(fields);
  let getFieldsValues = Object.values<any>(fields);

  useEffect(() => {
    if (typeof fields != "object") return;

    const removeInvalidInputTypes = getFieldsValues.filter(
      (data) => validInputTypwWordRegex.test(data) === true
    );
    setState(removeInvalidInputTypes);
  }, [fields]);

  // for adding preloaded data
  useEffect(() => {
    if (!preloadData) return;
    if (typeof form !== "object") return;
    for (let x = 0; x < Object.keys(preloadData).length; x++) {
      let dataKey = Object.keys(preloadData);
      let dataValue = Object.values(preloadData);

      setForm((prev: object) => ({ ...prev, [dataKey[x]]: dataValue[x] }));
    }
  }, [preloadData]);

  const shouldAddBtn = buttonWordRegex.test(Object.values(fields).join(""));

  const getButtonIndexOfKey = Object.values(fields).findIndex((data) =>
    buttonWordRegex.test(data)
  );
  const getButtonName = getFieldsKeys[getButtonIndexOfKey];

  const onChange = (e: any) => {
    let name = e.target.name;
    let value = e.target.value;
    let type = e.target.type;
    setForm((prev: any) => ({
      ...prev,
      //because checkbox value returns empty string, replace with true
      [name]:
        type !== "checkbox"
          ? value
          : type === "checkbox" && !value
          ? true
          : value,
    }));
  };

  useEffect(() => {
    if (!fields) return;
    Object.keys(fields).map((data) => {
      //duplicate error message key, to reset errors to empty string
      setStoreErrorKeyNamesForReference({ [`${data}-error-message`]: "" });
      setErrors((prev: object) => ({
        ...prev,
        [`${data}-error-message`]: "",
      }));
    });
  }, [fields]);

  const handleButton = (e: any) => {
    e.preventDefault();
    if (!passedValidation(fields, form, setErrors)) return;

    setErrors(getErrorKeyNamesForReference);

    setDisableButton(true);

    if (!payload) return;
    payload(removeUnnecessaryData(form), isAccepted, notAccepted);
    setDisableButton(true);
  };

  const emptyForm = () => {
    setForm({});
  };

  const isAccepted = () => {
    setDisableButton(false);
    emptyForm();
  };
  const notAccepted = () => {
    setDisableButton(false);
  };
  // change password visibility in state
  const handleShowPassword = (name: string, showPassword: boolean) => {
    if (getFieldsKeys.includes(name)) {
      let passwordlocation = getFieldsKeys.findIndex(
        (data: string) => data === name
      );
      if (!passwordlocation) return;
      let r = getFieldsValues?.[passwordlocation];
      let replace = r.replace(
        showPassword ? "password" : "text",
        showPassword ? "text" : "password"
      );
      setState((prev: any) =>
        prev.map((data: any, index: number) => {
          if (index === passwordlocation) {
            return replace;
          } else {
            return data;
          }
        })
      );
    }
  };

  return (
    <form className="_bootstraped-form-container">
      {state?.map((data: String, index) => {
        const {
          type,
          getFormLabel: name,
          className,
          required,
          placeholder,
        } = getPropValues(data, index, getFieldsKeys) || {};

        let props = {
          className: `_${className}`,
          type,
          required,
          placeholder,
          onChange,
          value: form[name] || "",
          name,
        };
        const visibilityProps = {
          name,
          props,
          handleShowPassword,
        };

        return (
          <div key={index} className="_form_inner_container">
            <label className={`_form-label`}>{getProperWord(name)}</label>
            {selectWordRegex?.test(String(data)) ? (
              <>
                <SelectBox props={props} name={name} data={data} />
                <p className="_error-message">
                  {errors[`${name}-error-message`]}
                </p>
              </>
            ) : (
              <>
                {hasVisibilityRegex?.test(String(data)) ? (
                  <Visibility {...visibilityProps} />
                ) : (
                  <input {...props} />
                )}

                <p className="_error-message">
                  {errors[`${name}-error-message`]}
                </p>
              </>
            )}
          </div>
        );
      })}
      {shouldAddBtn && (
        <button
          className={`_form-button`}
          onClick={handleButton}
          disabled={disableButton}
        >
          {!disableButton ? getProperWord(getButtonName) : "Please wait..."}
        </button>
      )}
    </form>
  );
}
