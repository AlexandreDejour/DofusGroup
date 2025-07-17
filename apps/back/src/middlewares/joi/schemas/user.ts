import Joi from "joi";

const passwordRegex = new RegExp(
  "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{};'\":\\\\|,.<>/?`~]).{8,}$",
);

export const createUserSchema = Joi.object({
  username: Joi.string().alphanum().required().messages({
    "string.empty": "Username is required.",
    "string.alphanum": "Username must be alphanumeric.",
    "any.required": "Username is required.",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "Password can't be empty.",
    "string.pattern.base": "Invalid password. Doesn't respect minimum rules.",
    "any.required": "Password is required.",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords don't match",
    "string.empty": "Confirm Password can't be empty.",
    "any.required": "Confirm Password is required.",
  }),
  mail: Joi.string().email().required().messages({
    "string.email": "Invalid mail address.",
    "string.empty": "Mail can't be empty.",
    "any.required": "Mail is required.",
  }),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().messages({
    "string.alphanum": "Username must be alphanumeric.",
    "string.base": "Username must be a string.",
  }),
  password: Joi.string().pattern(passwordRegex).messages({
    "string.pattern.base": "Invalid password. Doesn't respect minimum rules.",
    "string.base": "Password must be a string.",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).messages({
    "any.only": "Passwords don't match.",
    "string.base": "Confirm Password must be a string.",
  }),
  mail: Joi.string().email().messages({
    "string.email": "Invalid mail address.",
    "string.base": "Mail must be a string.",
  }),
})
  .custom((value, helpers) => {
    if (value.password && !value.confirmPassword) {
      return helpers.error("any.custom", {
        message: "Confirm password is required when password is provided.",
      });
    }
    return value;
  })
  .messages({
    "any.custom": "{{#message}}",
  });
