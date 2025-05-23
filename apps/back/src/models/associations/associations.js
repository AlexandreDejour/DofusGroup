import { client } from "../../client/client.js";

import { Tag } from "../Tag.js";
import { User } from "../User.js";
import { Breed } from "../Breeds.js";
import { Event } from "../Event.js";
import { Server } from "../Server.js";
import { Character } from "../Character.js";

Tag.hasMany(Event, {
    foreignKey: "event_id",
    as: "events"
});

Event.belongsTo(Tag, {
    as: "tag"
});

User.hasMany(Event, {
    foreignKey: "event_id",
    as: "events"
});

Event.hasOne(User, {
    foreignKey: "user_id",
    as: "author"
});

User.hasMany(Character, {
    foreignKey: "character_id",
    as: "characters"
});

Character.belongsTo(User, {
    as: "user"
});

Breed.hasMany(Character, {
    foreignKey: "character_id",
    as: "characters"
});

Character.belongsTo(Breed, {
    as: "breed"
});

Event.belongsToMany(Character, {
    foreignKey: "event_id",
    otherKey: "character_id",
    as: "teams",
    through:"event_team"
});

Character.belongsToMany(Event, {
    foreignKey: "character_id",
    otherKey: "event_id",
    as: "events",
    through: "event_team"
});

Server.hasMany(Character, {
    foreignKey: "character_id",
    as : "characters"
});

Character.belongsTo(Server, {
    as: "server"
});

Server.hasMany(Event, {
    foreignKey: "event_id",
    as: "characters"
});

Event.belongsTo(Server, {
    as: "server"
});

export { client, Tag, User, Event, Breed, Server, Character };



