import Validator from "validator";

const validateRegisterInput = (data) => {
  let errors = {};

  // Convert empty fields to empty string for validator
  data.username = !data.username ? "" : data.username;
  data.email = !data.email ? "" : data.email;
  data.password = !data.password ? "" : data.password;
  data.user_unique_id = !data.user_unique_id ? "" : data.user_unique_id;

  // Username checks
  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  } else if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = "Username must be between 2 and 30 characters";
  }

  // User unique ID checks
  if (Validator.isEmpty(data.user_unique_id)) {
    errors.user_unique_id = "User ID is required";
  } else if (!Validator.isLength(data.user_unique_id, { min: 2, max: 4 })) {
    errors.user_unique_id = "User ID must be between 3 and 8 characters";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export default validateRegisterInput;
