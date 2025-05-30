import Joi from "joi";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]).{8,}$/;

const createSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .required()
        .messages({ "username.required": "Username can't be empty."}),
    password: Joi.string()
        .pattern(passwordRegex)
        .required()
        .messages({
            "password.string": "Password must be a string.",
            "password.pattern": "Invalid password. Doesn't respect minimum rules.",
            "password.required": "Password can't be empty."
         }),
    confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            "password.string": "Password must be a string.",
            "password.valid": "Passwords don't match",
            "password.required": "Confirm password can't be empty."
         }),
    mail: Joi.string()
        .email()
        .required()
        .messages({
            "mail.string": "Mail must be a string.",
            "mail.email": "Invalid mail adress.",
            "mail.required": "Mail can't be empty."
        }),
    avatar: Joi.string()
        .uri()
});

const updateSchema = Joi.object({
    username: Joi.string()
        .alphanum(),
    password: Joi.string()
        .pattern(passwordRegex)
        .messages({
            "string.base": "Password must be a string.",
            "string.pattern.base": "Invalid password. Doesn't respect minimum rules."
         }),
    confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .messages({
            "string.base": "Password must be a string.",
            "any.only": "Passwords don't match.",
            "any.required": "Confirm password can't be empty."
         }),
    mail: Joi.string()
        .email(),
    avatar: Joi.string()
        .uri()
}).with("password", "confirm_password");

export { createSchema, updateSchema };
