import * as Joi from "joi";

export const semi = Joi.object({
    id: Joi
        .string()
        .required(),
    name: Joi
        .string()
        .required(),
    description: Joi
        .string()
        .optional(),
    level: Joi
        .string()
        .required()
        .valid('warn', 'error'),
});
