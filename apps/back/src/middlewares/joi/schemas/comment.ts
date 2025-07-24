import Joi from "joi";

export const createCommentSchema: Joi.ObjectSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.empty": "Name can't be empty",
    "string.min": "Name must be at least 1 character long",
    "any.required": "Name is required",
  }),
  event_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "Event ID must be a valid UUID v4",
    "any.required": "Event ID is required",
    "string.base": "Event ID must be a string",
  }),
});

export const updateCommentSchema: Joi.ObjectSchema = Joi.object({
  content: Joi.string().min(1).optional().messages({
    "string.empty": "Name can't be empty",
    "string.min": "Name must be at least 1 character long",
    "string.base": "Alignment must be a string",
  }),
  event_id: Joi.string().guid({ version: "uuidv4" }).optional().messages({
    "string.guid": "Event ID must be a valid UUID v4",
    "string.base": "Event ID must be a string",
  }),
});
