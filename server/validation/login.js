import Validator from "validator";

const validateLoginInput = (data) => {
  let errors = {};

  // Convert empty fields to empty string for validator
  data.email = !data.email ? "" : data.email;
  data.password = !data.password ? "" : data.password;

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export default validateLoginInput;
