import Joi from "joi";

const createSchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .min(0)
        .required(),
    name: Joi.string()
        .required()
        .messages({ "name.required": "Name can't be empty."}),
    sex: Joi.string()
        .valid("male", "female")
        .required()
        .messages({
            "sex.valid": "Invalid entry, only male or female accepted",
            "sex.required": "Sex can't be empty."
         }),
    level: Joi.number()
        .integer()
        .min(1)
        .max(200)
        .required()
        .messages({
            "level.integer": "Level must be an integer.",
            "level.min": "Level can't be lower than 1",
            "level.max": "Level can't be upper than 200",
            "level.required": "Level can't be empty."
         }),
    server_id: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({ "server.any": "Level is required."}),
    alignment: Joi.string()
        .valid("Brakmar", "Bonta")
        .messages({
            "alignment.string": "alignment must be a string.",
            "alignment.valid": "Only accept Brakmar or Bonta."
        }),
    breed_id: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({ "breed.any": "Breed is required."}),
    stuff: Joi.string()
        .uri()
        .messages({
            "stuff.string": "Stuff must be a string.",
            "stuff.uri": "Only accept DofusBook URL."
        }),
    default_character: Joi.boolean(),
});

const updateSchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .min(0),
    name: Joi.string()
        .alphanum()
        .messages({ "name.string": "Name must be a string."}),
    sex: Joi.string()
        .valid("male", "female")
        .messages({
            "sex.valid": "Invalid entry, only male or female accepted.",
         }),
    level: Joi.number()
        .integer()
        .min(1)
        .max(200)
        .messages({
            "level.integer": "Level must be an integer.",
            "level.min": "Level can't be lower than 1",
            "level.max": "Level can't be upper than 200."
         }),
    server_id: Joi.number()
        .integer()
        .min(0),
    alignment: Joi.string()
        .valid("Brakmar", "Bonta")
        .messages({
            "alignment.string": "Stuff must be a string.",
            "alignment.valid": "Only accept Brakmar or Bonta."
        }),
    breed_id: Joi.number()
        .integer()
        .min(0),
    stuff: Joi.string()
        .uri()
        .messages({
            "stuff.string": "Stuff must be a string.",
            "stuff.uri": "Only accept DofusBook URL."
        }),
    default_character: Joi.boolean(),
});

export { createSchema, updateSchema };
