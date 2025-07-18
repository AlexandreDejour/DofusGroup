import Joi from "joi";

const STATUS = ["public", "private"] as const;

export const createEventSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().min(1).max(50).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must be at most 50 characterss",
    "any.required": "Title is required",
  }),
  date: Joi.date().min("now").iso().required().messages({
    "date.empty": "Date is required",
    "date.min": "Date must be equal or upper than now",
    "any.required": "Date is required",
  }),
  duration: Joi.number().min(1).max(1440).required().messages({
    "number.base": "Duration must be a number",
    "number.min": "Duration must be least 1 character long",
    "number.max": "Duration must be at most 1440",
    "any.required": "Duration is required",
  }),
  area: Joi.string().min(1).max(50).required().messages({
    "string.empty": "Area is required",
    "string.min": "Area must be at least 1 character long",
    "string.max": "Area must be at most 50 characterss",
    "any.required": "Area is required",
  }),
  sub_area: Joi.string().min(1).max(50).required().messages({
    "string.empty": "Sub area is required",
    "string.min": "Sub area must be at least 1 character long",
    "string.max": "Sub area must be at most 50 characterss",
    "any.required": "Sub area is required",
  }),
  donjon_name: Joi.string().min(1).max(50).required().messages({
    "string.empty": "Donjon name is required",
    "string.min": "Donjon name must be at least 1 character long",
    "string.max": "Donjon name must be at most 50 characterss",
    "any.required": "Donjon name is required",
  }),
  description: Joi.string().min(1).max(255).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 1 character long",
    "string.max": "Description must be at most 255 characters",
    "any.required": "Description is required",
  }),
  max_players: Joi.number().min(1).max(8).required().messages({
    "number.base": "Max players must be a number",
    "number.min": "Max players must be least 1 character long",
    "number.max": "Max players must be at most 8",
    "any.required": "Max players is required",
  }),
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({
      "any.only": `Status must be either ${STATUS.join(", ")}`,
      "string.base": "Status must be a string",
    }),
  tag_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "User ID must be a valid UUID v4",
    "any.required": "User ID is required",
    "string.base": "User ID must be a string",
  }),
  user_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "User ID must be a valid UUID v4",
    "any.required": "User ID is required",
    "string.base": "User ID must be a string",
  }),
  server_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "Server ID must be a valid UUID v4",
    "any.required": "Server ID is required",
    "string.base": "Server ID must be a string",
  }),
  character_id: Joi.array()
    .items(Joi.string().guid({ version: "uuidv4" }).required())
    .min(1)
    .max(8)
    .required()
    .messages({
      "array.min": "Array must be least 1 character",
      "array.max": "Array must be at most 8 characters",
      "array.includes": "Le tableau contient un élément invalide",
    }),
});

export const updateEventSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().min(1).max(50).messages({
    "string.empty": "Title can't be empty",
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must be at most 50 characterss",
    "any.required": "Title is required",
  }),
  date: Joi.date().min("now").iso().messages({
    "date.empty": "Date can't be empty",
    "date.min": "Date must be equal or upper than now",
    "any.required": "Date is required",
  }),
  duration: Joi.number().min(1).max(1440).messages({
    "number.base": "Duration must be a number",
    "number.min": "Duration must be least 1 character long",
    "number.max": "Duration must be at most 1440",
    "any.required": "Duration is required",
  }),
  area: Joi.string().min(1).max(50).messages({
    "string.empty": "Area can't be empty",
    "string.min": "Area must be at least 1 character long",
    "string.max": "Area must be at most 50 characterss",
    "any.required": "Area is required",
  }),
  sub_area: Joi.string().min(1).max(50).messages({
    "string.empty": "Sub area can't be empty",
    "string.min": "Sub area must be at least 1 character long",
    "string.max": "Sub area must be at most 50 characterss",
    "any.required": "Sub area is required",
  }),
  donjon_name: Joi.string().min(1).max(50).messages({
    "string.empty": "Donjon can't be empty",
    "string.min": "Donjon name must be at least 1 character long",
    "string.max": "Donjon name must be at most 50 characterss",
    "any.required": "Donjon name is required",
  }),
  description: Joi.string().min(1).max(255).messages({
    "string.empty": "Description can't be empty",
    "string.min": "Description must be at least 1 character long",
    "string.max": "Description must be at most 255 characters",
    "any.required": "Description is required",
  }),
  max_players: Joi.number().min(1).max(8).messages({
    "number.base": "Max players must be a number",
    "number.min": "Max players must be least 1 character long",
    "number.max": "Max players must be at most 8",
    "any.required": "Max players is required",
  }),
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({
      "any.only": `Status must be either ${STATUS.join(", ")}`,
      "string.base": "Status must be a string",
    }),
  tag_id: Joi.string().guid({ version: "uuidv4" }).messages({
    "string.guid": "User ID must be a valid UUID v4",
    "any.required": "User ID is required",
    "string.base": "User ID must be a string",
  }),
  user_id: Joi.string().guid({ version: "uuidv4" }).messages({
    "string.guid": "User ID must be a valid UUID v4",
    "any.required": "User ID is required",
    "string.base": "User ID must be a string",
  }),
  server_id: Joi.string().guid({ version: "uuidv4" }).messages({
    "string.guid": "Server ID must be a valid UUID v4",
    "any.required": "Server ID is required",
    "string.base": "Server ID must be a string",
  }),
  character_id: Joi.array()
    .items(Joi.string().guid({ version: "uuidv4" }))
    .min(1)
    .max(8)
    .messages({
      "array.min": "Array must be least 1 character",
      "array.max": "Array must be at most 8 characters",
      "array.includes": "Le tableau contient un élément invalide",
    }),
});
