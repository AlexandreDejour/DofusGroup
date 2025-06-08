import { Tag } from "../models/Tag.js";

const tagController = {
    /**
     * This method return all tags.
     * @param {Request} _req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getAll(_req, res, next) {
        const tags =  await Tag.findAll();

        if(!tags) {
            return next();
        };

        res.json(tags);
    },

    /**
     * This method return tag corresponding to id.
     * @param {Request} _req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getOne(req, res, next) {
        const { id } = req.params;

        const tag = await Tag.findByPk(id);

        if(!tag) {
            return next();
        };

        res.json(tag);
    }
};

export { tagController };