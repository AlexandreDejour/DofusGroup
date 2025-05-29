function validateInt(req, _res, next) {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        const error = new Error("Not found");

        error.statusCode = 404;

        return next(error);
    };

    next();
};

export { validateInt };