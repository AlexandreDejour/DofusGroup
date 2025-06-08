import { Event } from "../models/Event.js";

const eventController = {
    /**
     * This method return all events with their tag, server and characters.
     * @param {Request} _req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getAll(_req, res, next) {
        const events =  await Event.findAll({
            include: [
                { association: "tag" },
                { association: "server" },
                { association: "characters" }
            ]
        });

        if(!events) {
            return next();
        };

        res.json(events);
    },

    /**
     * This method return event corresponding to id.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async getOne(req, res, next) {
        const { id } = req.params;

        const event = await Event.findByPk(id);

        if(!event) {
            return next();
        };

        res.json(event);
    },

    /**
     * This method take JSON object in req.body and create a new event in database.
     * @param {Request} req 
     * @param {Response} res 
     */
    async post(req, res) {
        const {
            title,
            date,
            duration,
            area,
            subarea,
            donjon_name,
            max_players,
            description,
            status
        } = req.body;

        const newEvent = await Event.create({ 
            title: title,
            date: date,
            duration: duration,
            area: area,
            subarea: subarea,
            donjon_name: donjon_name,
            max_players: max_players,
            description: description,
            status: status
        });

        res.status(201).json(newEvent);
    },

    /**
     * This method find event corresponding with id and update their values.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     * @returns {Promise<void>}
     */
    async update(req, res, next) {
        const { id } = req.params;
        const {
            title,
            date,
            duration,
            area,
            subarea,
            donjon_name,
            max_players,
            description,
            status
        } = req.body;

        const eventToUpdate = await Event.findByPk(id);

        if(!eventToUpdate) {
            const error = new Error("Event not found");
            error.status = 404;
            return next(error);
        };

        const updatedEvent = await Event.update({
            title: title || eventToUpdate.title,
            date: date || eventToUpdate.date,
            duration: duration || eventToUpdate.duration,
            area: area || eventToUpdate.area,
            subarea: subarea || eventToUpdate.subarea,
            donjon_name: donjon_name || eventToUpdate.donjon_name,
            max_players: max_players || eventToUpdate.max_players,
            description: description || eventToUpdate.description,
            status: status || eventToUpdate.status
        });

        res.json(updatedEvent);
    },

    /**
     * This method find event correponding to id delete it from the database.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async delete(req, res, next) {
        const { id } = req.params;

        const event = await Event.findByPk(id);

        if(!event) {
            return next();
        };
        await Event.destroy({ where: { id : id }});

        res.status(204).end();
    }
};

export { eventController };