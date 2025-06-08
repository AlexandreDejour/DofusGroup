function notFound(_req, _res, next) {
    const error = new Error("Not found");

    error.status = 404;

    next(error);
};

function errorHandler(error, _req, res, _next) {
    const statusCode = error.statusCode || error.status || 500;

    console.error(error);
    
    res.status(statusCode).json({ error: true, message: error.message });
};

export { notFound, errorHandler };