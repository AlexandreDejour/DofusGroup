import Joi from "joi";

const passwordRegex = new RegExp(
  "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{};'\":\\\\|,.<>/?`~]).{8,}$",
);

export const loginSchema: Joi.ObjectSchema = Joi.object({
  mail: Joi.string().email().required().messages({
    "string.email": "Invalid mail address.",
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
  sub: Joi.string(),
});

export const authUserSchema: Joi.ObjectSchema = Joi.object({
  "x-user-id-x": Joi.string()
    .guid({ version: "uuidv4" })
    .optional()
    .messages({
      "string.guid": "Userid must be UUID V4",
      "string.base": "User id must be a string",
    })
    .custom((data) => {
      return {
        id: data["x-user-id"],
      };
    }),
});
