import { Breed } from "../models/Breed.js";

const breedController = {
    /**
     * This method return all breeds.
     * @param {Request} _req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getAll(_req, res, next) {
        const breeds =  await Breed.findAll();

        if(!breeds) {
            return next();
        };

        res.json(breeds);
    },

    /**
     * This method return breed corresponding to id.
     * @param {Request} _req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getOne(req, res, next) {
        const { id } = req.params;

        const breed = await Breed.findByPk(id);

        if(!breed) {
            return next();
        };

        res.json(breed);
    }
};

export { breedController };