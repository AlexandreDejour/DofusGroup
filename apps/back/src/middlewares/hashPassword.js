import argon2 from "argon2";

/**
 * This function hash password in req.body if exists to increase user's datas security.
 * @param {Request} req 
 * @param {Response} _res 
 * @param {Function} next 
 */
async function hashPassword(req, _res, next) {
    if (req.body.password) {
        const { password } = req.body;
    
        try {
            const hash = await argon2.hash(password);
    
            req.body.password = hash;
    
            next();
        } catch (error) {
            console.error("Password hashing error:", error);
    
            next(new Error("Internal server error during password hashing."));
        }
    } else next();
}

export { hashPassword };