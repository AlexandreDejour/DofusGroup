import Joi from "joi";

const createSchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .min(0)
        .required(),
    title: Joi.string()
        .required()
        .messages({ "title.required": "Title can't be empty."}),
    tag_id: Joi.number()
        .integer()
        .min(0)
        .max(6)
        .required()
        .messages({ "server.any": "Tag is required."}),
    date: Joi.date()
        .required()
        .messages({
            "date.base": "Date must be valid",
            "date.required": "Date can't be empty."
         }),
    duration: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .messages({
            "duration.integer": "duration must be an integer.",
            "duration.min": "Duration can't be lower than 1",
            "duration.max": "Duration can't be upper than 12"
         }),
    area: Joi.string()
        .messages({ "area.string": "Stuff must be a string." }),
    subarea: Joi.string()
        .messages({ "area.string": "Sub_area must be a string." }),
    donjon_name: Joi.string()
        .messages({ "area.string": "Donjon must be a string." }),
    max_players: Joi.number()
        .integer()
        .min(2)
        .max(8)
        .messages({
            "max_player.base" : "Max player must be an integer.",
            "max_player.min" : "Max player can't be lower than 2.",
            "max_player.max" : "Max player can't be upper than 8."
        }),
    description: Joi.string()
        .alphanum()
        .messages({ "area.string": "Description must be a string." }),
    status: Joi.string()
        .valid("private", "public")
        .messages({
            "string.base": "Stuff must be a string.",
            "status.valid": "Only accept private or public."
        }),
    server_id: Joi.number()
        .integer()
        .min(0)
        .max(12)
        .required()
        .messages({ "server.number": "Server is required."})
});

const updateSchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .min(0),
    title: Joi.string()
        .messages({ "title.required": "Title can't be empty."}),
    tag_id: Joi.number()
        .integer()
        .min(0)
        .messages({ "server.any": "Tag is required."}),
    date: Joi.date()
        .messages({
            "date.base": "Date must be valid",
            "date.required": "Date can't be empty."
         }),
    duration: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .messages({
            "duration.integer": "duration must be an integer.",
            "duration.min": "Duration can't be lower than 1",
            "duration.max": "Duration can't be upper than 12"
         }),
    area: Joi.string()
        .messages({ "area.string": "Stuff must be a string." }),
    sub_area: Joi.string()
        .messages({ "area.string": "Sub_area must be a string." }),
    donjon: Joi.string()
        .messages({ "area.string": "Donjon must be a string." }),
    max_players: Joi.number()
        .integer()
        .min(2)
        .max(8)
        .messages({
            "max_player.base" : "Max player must be an integer.",
            "max_player.min" : "Max player can't be lower than 2.",
            "max_player.max" : "Max player can't be upper than 8."
        }),
    description: Joi.string()
        .alphanum()
        .messages({ "area.string": "Description must be a string." }),
    status: Joi.string()
        .valid("private", "public")
        .messages({
            "string.base": "Stuff must be a string.",
            "status.valid": "Only accept private or public."
        }),
    server_id: Joi.number()
        .integer()
        .min(0)
        .messages({ "server.any": "Server is required."})
});

export { createSchema, updateSchema };
