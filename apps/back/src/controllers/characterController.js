import { Character } from "../models/Character.js";

const characterController = {
    /**
     * This method return character corresponding to id.
     * @param {Request} _req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getOne(req, res, next) {
        const { id } = req.params;

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
        const { 
            user_id,
            name,
            sex,
            level,
            server_id,
            alignment,
            breed_id,
            stuff,
            default_character 
        } = req.body;

        const newCharacter = await Character.create({ 
            user_id: user_id,
            name: name,
            sex: sex,
            level: level,
            server_id: server_id,
            alignment: alignment,
            breed_id: breed_id,
            stuff: stuff,
            default_character: default_character
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
        const { 
            user_id,
            name,
            sex,
            level,
            server_id,
            alignment,
            breed_id,
            stuff,
            default_character 
        } = req.body;

        const characterToUpdate = await Character.findByPk(id);

        if(!characterToUpdate) {
            return next();
        };

        const updatedCharacter = await characterToUpdate.update({
            user_id: user_id || characterToUpdate.user_id,
            name: name || characterToUpdate.name,
            sex: sex || characterToUpdate.sex,
            level: level || characterToUpdate.level,
            server_id: server_id || characterToUpdate.server_id,
            alignment: alignment || characterToUpdate.alignment,
            breed_id: breed_id || characterToUpdate.breed_id,
            stuff: stuff || characterToUpdate.stuff,
            default_character: default_character || characterToUpdate.default_character
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

        await Character.destroy({ where: { id : id }});

        res.status(204).end();
    }
};

export { characterController };