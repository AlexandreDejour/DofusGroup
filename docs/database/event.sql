CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    duration INTEGER,
    area VARCHAR(255),
    sub_area VARCHAR(255),
    donjon_name VARCHAR(255),
    description VARCHAR(255),
    max_players INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'public',
    tag_id UUID NOT NULL,
    user_id UUID NOT NULL,
    server_id UUID NOT NULL,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_server FOREIGN KEY (server_id) REFERENCES servers(id)
);
