import { User } from "../models/User.js";

const userController = {
    /**
     * This method return user with their characters and events.
     * @param {Request} _req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getOne(_req, res, next) {
        const { id } = res.params;

        const user = await User.findByPk(id, {
            include: [
                { association: "characters" },
                { association: "events"}
            ]
        });

        if(!user) {
            return next();
        };

        res.json(user);
    },

    /**
     * This method take JSON object in req.body and create a new user in database.
     * @param {Request} req 
     * @param {Response} res 
     */
    async post(req, res) {
        const { username, password, mail, avatar } = req.body;

        // todo: securise password and mail

        const newUser = await User.create({ 
            username: username,
            password: password,
            mail: mail,
            avatar: avatar
        });

        res.status(201).json(newUser);
    },

    /**
     * This method find user corresponding with id and update their values.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async update(req, res, next) {
        const { id } = req.params;
        const { username, password, mail, avatar } = req.body;

        const userToUpdate = await User.findByPk(id);

        if(!userToUpdate) {
            return next();
        };

        const updatedUser = await User.update({
            username: username || userToUpdate.username,
            password: password || userToUpdate.password,
            mail: mail || userToUpdate.mail,
            avatar: avatar || userToUpdate.avatar
        });

        res.json(updatedUser);
    },

    /**
     * This method find user correponding to id delete it from the database.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async delete(req, res, next) {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if(!user) {
            return next();
        };

        await User.destroy();

        res.status(204).end();
    }
};

export { userController };