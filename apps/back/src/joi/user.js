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
            "string.base": "Password must be a string.",
            "string.pattern.base": "Invalid password. Doesn't respect minimum rules.",
            "any.required": "Password can't be empty."
         }),
    confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "any.only": "Passwords don't match",
            "any.required": "Confirm password can't be empty."
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
            "any.only": "Passwords don't match."
         }),
    mail: Joi.string()
        .email(),
    avatar: Joi.string()
        .uri()
}).custom((value, helpers) => {
    if (value.password && !value.confirm_password) {
        return helpers.error("any.custom", { message: "Confirm password is required when password is provided." });
    }
    return value;
    }).messages({
    "any.custom": "{{#message}}"
    });

export { createSchema, updateSchema };
