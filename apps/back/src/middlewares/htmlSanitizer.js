import sanitizeHtml from 'sanitize-html';

function htmlSanitizer(req, _res, next) {
    try {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeHtml(req.body[key]);
            }
        });

        next();
    } catch (error) {
        console.error("Html sanitizing error:", error);
        next(new Error("Internal server error during HTML sanitizing."));
    }
};

export { htmlSanitizer };
