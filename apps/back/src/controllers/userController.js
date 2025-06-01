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
            attributes: { exclude: ['password', 'mail'] },
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

        if (username !== undefined) userToUpdate.username = username;
        if (password !== undefined) userToUpdate.password = password;
        if (mail !== undefined) userToUpdate.mail = mail;
        if (avatar !== undefined) userToUpdate.avatar = avatar;

        await userToUpdate.save();

        const userData = userToUpdate.get({ plain: true });
        delete userData.password;
        delete userData.mail;

        res.json(userData);
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

        await user.destroy();

        res.status(204).end();
    }
};

export { userController };