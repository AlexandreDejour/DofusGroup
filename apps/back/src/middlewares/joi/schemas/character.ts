import Joi from "joi";

const ALIGNMENTS = ["Brâkmar", "Neutre", "Bonta"] as const;
const SEXES = ["M", "F"] as const;

export const createCharacterSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().min(1).max(20).required().messages({
    "string.empty": "Name can't be empty",
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name must be at most 20 characters",
    "any.required": "Name is required",
  }),
  sex: Joi.string()
    .valid(...SEXES)
    .required()
    .messages({
      "any.only": `Sex must be either ${SEXES.join(", ")}`,
      "any.required": "Sex is required",
      "string.base": "Sex must be a string",
    }),
  level: Joi.number().integer().min(1).max(200).required().messages({
    "number.base": "Level must be a number",
    "number.integer": "Level must be an integer",
    "number.min": "Level must be at least 1",
    "number.max": "Level must be at most 200",
    "any.required": "Level is required",
  }),
  alignment: Joi.string()
    .valid(...ALIGNMENTS)
    .optional()
    .messages({
      "any.only": `Alignment must be either ${ALIGNMENTS.join(", ")}`,
      "string.base": "Alignment must be a string",
    }),
  stuff: Joi.string().uri().optional().messages({
    "string.uri": "Stuff must be a valid URL",
    "string.base": "Stuff must be a string",
  }),
  default_character: Joi.boolean().optional(),
  user_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "User ID must be a valid UUID v4",
    "any.required": "User ID is required",
    "string.base": "User ID must be a string",
  }),
  breed_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "Breed ID must be a valid UUID v4",
    "any.required": "Breed ID is required",
    "string.base": "Breed ID must be a string",
  }),
  server_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "Server ID must be a valid UUID v4",
    "any.required": "Server ID is required",
    "string.base": "Server ID must be a string",
  }),
});

export const updateCharacterSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().min(1).max(20).optional().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name must be at most 20 characters",
    "string.base": "Name must be a string",
  }),
  sex: Joi.string().valid("M", "F").optional().messages({
    "any.only": "Sex must be either 'M' or 'F'",
    "string.base": "Sex must be a string",
  }),
  level: Joi.number().integer().min(1).max(200).optional().messages({
    "number.integer": "Level must be an integer",
    "number.min": "Level must be at least 1",
    "number.max": "Level must be at most 200",
    "number.base": "Level must be a number",
  }),
  alignment: Joi.string()
    .valid("Brâkmar", "Neutre", "Bonta")
    .optional()
    .messages({
      "any.only": `Alignment must be either ${ALIGNMENTS.join('", "')}`,
      "string.base": "Alignment must be a string",
    }),
  stuff: Joi.string().uri().optional().messages({
    "string.uri": "Stuff must be a valid URL",
    "string.base": "Stuff must be a string",
  }),
  default_character: Joi.boolean().optional(),
  breed_id: Joi.string().guid({ version: "uuidv4" }).optional().messages({
    "string.guid": "Breed ID must be a valid UUID v4",
    "string.base": "Breed ID must be a string",
  }),
  server_id: Joi.string().guid({ version: "uuidv4" }).optional().messages({
    "string.guid": "Server ID must be a valid UUID v4",
    "string.base": "Server ID must be a string",
  }),
});
