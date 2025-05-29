import { Character } from "../models/Character.js";

const characterController = {
    /**
     * This method return character corresponding to id.
     * @param {Request} _req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getOne(_req, res, next) {
        const { id } = res.params;

        const character = await Character.findByPk(id);

        if(!character) {
            return next();
        };

        res.json(character);
    },

    /**
     * This method take JSON object in req.body and create a new character in database.
     * @param {Request} req 
     * @param {Response} res 
     */
    async post(req, res) {
        const { name, sex, level, alignment, stuff } = req.body;

        const newCharacter = await Character.create({ 
            name: name,
            sex: sex,
            level: level,
            alignment: alignment,
            stuff: stuff
        });

        res.status(201).json(newCharacter);
    },

    /**
     * This method find character corresponding with id and update their values.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async update(req, res, next) {
        const { id } = req.params;
        const { name, sex, level, alignment, stuff } = req.body;

        const characterToUpdate = await Character.findByPk(id);

        if(!characterToUpdate) {
            return next();
        };

        const updatedCharacter = await Character.update({
            name: name || characterToUpdate.name,
            sex: sex || characterToUpdate.sex,
            level: level || characterToUpdate.level,
            alignment: alignment || characterToUpdate.alignment,
            stuff: stuff || characterToUpdate.stuff
        });

        res.json(updatedCharacter);
    },

    /**
     * This method find character correponding to id delete it from the database.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async delete(req, res, next) {
        const { id } = req.params;

        const character = await Character.findByPk(id);

        if(!character) {
            return next();
        };

        await Character.destroy();

        res.status(204).end();
    }
};

export { characterController };