function notFound(_req, _res, next) {
    const error = new Error("Not found");

    error.status = 404;

    next(error);
};

function errorHandler(error, _req, res, _next) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({ message: error.message });
}