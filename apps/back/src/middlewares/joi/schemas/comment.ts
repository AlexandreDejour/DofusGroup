import Joi from "joi";

export const createCommentSchema: Joi.ObjectSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.empty": "Name can't be empty",
    "string.min": "Name must be at least 1 character long",
    "any.required": "Name is required",
  }),
});

export const updateCommentSchema: Joi.ObjectSchema = Joi.object({
  content: Joi.string().min(1).optional().messages({
    "string.empty": "Name can't be empty",
    "string.min": "Name must be at least 1 character long",
    "string.base": "Alignment must be a string",
  }),
});
