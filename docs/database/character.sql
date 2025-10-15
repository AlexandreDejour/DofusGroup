CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    name VARCHAR(255) NOT NULL,
    sex VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL,
    alignment VARCHAR(100),
    stuff VARCHAR(255),
    user_id UUID NOT NULL,
    server_id UUID NOT NULL,
    breed_id UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_server FOREIGN KEY (server_id) REFERENCES servers(id),
    CONSTRAINT fk_breed FOREIGN KEY (breed_id) REFERENCES breeds(id)
);
