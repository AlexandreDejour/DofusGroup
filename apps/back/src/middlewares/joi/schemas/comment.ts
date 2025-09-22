import Joi from "joi";

export const createCommentSchema: Joi.ObjectSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.empty": "Content can't be empty",
    "string.min": "Content must be at least 1 character long",
    "any.required": "Content is required",
  }),
  event_id: Joi.string().guid({ version: "uuidv4" }).optional().messages({
    "string.guid": "Event ID must be a valid UUID v4",
    "string.base": "Event ID must be a string",
  }),
  user_id: Joi.string().guid({ version: "uuidv4" }).optional().messages({
    "string.guid": "User ID must be a valid UUID v4",
    "string.base": "User ID must be a string",
  }),
});

export const updateCommentSchema: Joi.ObjectSchema = Joi.object({
  content: Joi.string().min(1).optional().messages({
    "string.empty": "Content can't be empty",
    "string.min": "Content must be at least 1 character long",
    "string.base": "Content must be a string",
  }),
  user_id: Joi.string().guid({ version: "uuidv4" }).optional().messages({
    "string.guid": "User ID must be a valid UUID v4",
    "string.base": "User ID must be a string",
  }),
  event_id: Joi.string().guid({ version: "uuidv4" }).optional().messages({
    "string.guid": "Event ID must be a valid UUID v4",
    "string.base": "Event ID must be a string",
  }),
});
