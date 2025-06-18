import Joi from "joi";

export const createCharacterSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().min(1).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name must be at most 20 characters",
  }),
  sex: Joi.string().valid("M", "F").required().messages({
    "sex.empty": "Sex is required",
    "sex.valid": "Sex must be either 'M' or 'F'",
  }),
  level: Joi.number().integer().min(1).max(200).required().messages({
    "level.empty": "Level is required",
    "level.min": "Level must be at least 1",
    "level.max": "Level must be at most 200",
    "level.integer": "Level must be an integer",
  }),
  alignment: Joi.string()
    .optional()
    .valid("Brâkmar", "Neutre", "Bonta")
    .messages({
      "alignment.valid":
        "Alignment must be either 'Brâkmar', 'Neutre', or 'Bonta'",
    }),
  stuff: Joi.string().uri().optional().messages({
    "stuff.uri": "Stuff must be a valid URL",
    "stuff.string": "Stuff must be a string",
    "struff.empty": "Stuff only accept DofusBook URL",
  }),
  default_character: Joi.boolean().optional(),
  user_id: Joi.number().integer().min(0).required().messages({
    "user_id.empty": "User ID is required",
    "user_id.integer": "User ID must be an integer",
    "user_id.min": "User ID must be at least 0",
  }),
  breed_id: Joi.number().integer().min(0).max(18).required().messages({
    "breed_id.empty": "Breed ID is required",
    "breed_id.integer": "Breed ID must be an integer",
    "breed_id.min": "Breed ID must be at least 0",
    "breed_id.max": "Breed ID must be at most 18",
  }),
  server_id: Joi.number().integer().min(0).max(12).required().messages({
    "server_id.empty": "Server ID is required",
    "server_id.integer": "Server ID must be an integer",
    "server_id.min": "Server ID must be at least 0",
    "server_id.max": "Server ID must be at most 12",
  }),
});

export const updateCharacterSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().min(1).max(20).optional().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name must be at most 20 characters",
  }),
  sex: Joi.string().valid("M", "F").optional().messages({
    "sex.valid": "Sex must be either 'M' or 'F'",
  }),
  level: Joi.number().integer().min(1).max(200).optional().messages({
    "level.min": "Level must be at least 1",
    "level.max": "Level must be at most 200",
    "level.integer": "Level must be an integer",
  }),
  alignment: Joi.string()
    .optional()
    .valid("Brâkmar", "Neutre", "Bonta")
    .messages({
      "alignment.valid":
        "Alignment must be either 'Brâkmar', 'Neutre', or 'Bonta'",
    }),
  stuff: Joi.string().uri().optional().messages({
    "stuff.uri": "Stuff must be a valid URL",
    "stuff.string": "Stuff must be a string",
    "stuff.empty": "Stuff only accept DofusBook URL",
  }),
  default_character: Joi.boolean().optional(),
  user_id: Joi.number().integer().min(0).optional().messages({
    "user_id.integer": "User ID must be an integer",
    "user_id.min": "User ID must be at least 0",
  }),
  breed_id: Joi.number().integer().min(0).max(18).optional().messages({
    "breed_id.integer": "Breed ID must be an integer",
    "breed_id.min": "Breed ID must be at least 0",
    "breed_id.max": "Breed ID must be at most 18",
  }),
  server_id: Joi.number().integer().min(0).max(12).optional().messages({
    "server_id.integer": "Server ID must be an integer",
    "server_id.min": "Server ID must be at least 0",
    "server_id.max": "Server ID must be at most 12",
  }),
});
