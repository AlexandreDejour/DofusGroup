function notFound(_req, _res, next) {
    const error = new Error("Not found");

    error.status = 404;

    next(error);
};

function errorHandler(error, _req, res, _next) {
    console.log("errorHandler called:", error.message)
    const statusCode = error.status || 500;

    res.status(statusCode).json({ error: true, message: error.message });
};

export { notFound, errorHandler };