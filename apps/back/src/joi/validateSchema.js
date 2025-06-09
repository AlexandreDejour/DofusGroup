/**
 * This function controls if req.body coresponding to define schema.
 * Increase security and datas's quality insert in database.
 * @param {Object} schema 
 * @returns 
 */
function validateSchema(schema) {
    return async (req, res, next) => {
        const data = req.body;

        try {
            await schema.validateAsync(data, { abortEarly: false });

            next();

        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: true,
                message: error.message,
                details: error.details?.map(detail => detail.message)
            });
        };
    };
};

export { validateSchema };