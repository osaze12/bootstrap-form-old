export const buttonWordRegex = /button|btn/i;
export const validInputTypwWordRegex =
  /text|textarea|number|select|email|password|checkbox/i;
export const selectWordRegex = /select/i;
export const enterWordRegex = /Enter|your/i;
export const requiredWordRegex = /required/i;
export const hasVisibilityRegex = /visibility/i;
export const arrayRegex = /\[.*?.*?\]/gm;
export const validEmailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const strongPasswordCheck =
  /^(?=(.*[a-z]){2,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;

export const getProperWord = (arrayOfChar: string) => {
  let charArray = arrayOfChar?.split("");
  if (!charArray) return arrayOfChar;
  let formatChars = charArray.map((data, i) =>
    data === data?.toUpperCase()
      ? ` ${data?.toUpperCase()}`
      : i === 0
      ? data?.toUpperCase()
      : data
  );

  return formatChars.join("");
};

export const removeUnnecessaryData = (data: any) => {
  let objectData = data;
  delete objectData?.confirmPassword;
  return objectData;
};

// for select input type,get the options
export const getSelectOptions = (data: String) => {
  let r = data.split("|").find((data) => arrayRegex.test(data));
  try {
    return eval(String(r));
  } catch {
    return [];
  }
};

export const getPropValues = (
  data: String,
  index: number,
  getFieldsKeys: any
) => {
  const type = data.split("|")?.[0];
  const getFormLabel = getFieldsKeys?.[index];

  const className = `${getFormLabel}-class`;

  const required =
    requiredWordRegex.test(String(data)) === false ? false : true;
  const placeholder =
    enterWordRegex.test(String(data)) === false
      ? ""
      : data.split("|").find((data) => enterWordRegex.test(data));

  return {
    type,
    getFormLabel,
    className,
    required,
    placeholder,
  };
};

export const passedValidation = (
  fields: object,
  form: any,
  setErrors: any
): boolean => {
  let r = Object.values(fields).map((data, index) => {
    let hasValidation = requiredWordRegex.test(data);
    let name = Object.keys(fields)[index];
    let hasValidInput = form?.[name];

    // strong password check
    if (name === "password") {
      if (strongPasswordCheck.test(form?.["password"]) === false) {
        setErrors((prev: any) => ({
          ...prev,
          [`${name}-error-message`]: `Must include at least one capital letter, number & special character `,
        }));
        return false;
      } else {
        setErrors((prev: any) => ({
          ...prev,
          [`${name}-error-message`]: ``,
        }));
      }
    }
    // strong email validation
    if (name === "email") {
      if (validEmailCheck.test(form?.["email"]) === false) {
        setErrors((prev: any) => ({
          ...prev,
          [`${name}-error-message`]: `Not a valid email`,
        }));
        return false;
      } else {
        setErrors((prev: any) => ({
          ...prev,
          [`${name}-error-message`]: ``,
        }));
      }
    }

    // check password match if there's a password & confirm password field
    if (name === "confirmPassword" && form?.["password"]) {
      if (form[name] !== form?.["password"]) {
        setErrors((prev: any) => ({
          ...prev,
          [`${name}-error-message`]: `password doesn't match`,
        }));
        return false;
      } else {
        setErrors((prev: any) => ({
          ...prev,
          [`${name}-error-message`]: ``,
        }));
      }
    }

    //if user doesnt want validation checked
    if (!hasValidation) return true;
    //if user wants validation and has entered valid input
    if (hasValidation && hasValidInput) return true;
    console.log(name);
    setErrors((prev: any) => ({
      ...prev,
      [`${name}-error-message`]: `${getProperWord(name)} cannot be empty`,
    }));
    return false;
  });

  //if there're no single errors in the array
  if (r.includes(false)) {
    return false;
  } else {
    return true;
  }
};
