import { Server } from "../models/Server.js";

const serverController = {
    /**
     * This method return all servers.
     * @param {Request} _req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getAll(_req, res, next) {
        const servers =  await Server.findAll();

        if(!servers) {
            return next();
        };

        res.json(servers);
    },

    /**
     * This method return server corresponding to id.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getOne(req, res, next) {
        const { id } = req.params;

        const server = await Server.findByPk(id);

        if(!server) {
            return next();
        };

        res.json(server);
    }
};

export { serverController };