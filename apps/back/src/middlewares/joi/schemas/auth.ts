import Joi from "joi";

const passwordRegex = new RegExp(
  "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{};'\":\\\\|,.<>/?`~]).{8,}$",
);

export const loginSchema: Joi.ObjectSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Mail can't be empty.",
    "any.required": "Mail is required.",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "Password can't be empty.",
    "string.pattern.base": "Invalid password. Doesn't respect minimum rules.",
    "any.required": "Password is required.",
  }),
});

export const jwtSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string(),
  iat: Joi.number().required(),
  exp: Joi.number().required(),
});

export const authUserSchema: Joi.ObjectSchema = Joi.object({
  userId: Joi.string().guid({ version: "uuidv4" }).optional().messages({
    "string.guid": "User id must be UUID V4",
    "string.base": "User id must be a string",
  }),
});
