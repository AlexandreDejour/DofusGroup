export async function up(queryInterface, Sequelize) {
  // pgcrypto extension (used for gen_random_uuid)
  await queryInterface.sequelize.query(
    `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`,
  );

  await queryInterface.createTable("tags", {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
  });

  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    is_verified: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verification_token: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
    },
    verification_expires_at: {
      type: Sequelize.DataTypes.DATE,
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
  });

  await queryInterface.createTable("servers", {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mono_account: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
  });

  await queryInterface.createTable("breeds", {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
  });

  await queryInterface.createTable("events", {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: Sequelize.DataTypes.INTEGER,
    },
    area: {
      type: Sequelize.DataTypes.STRING,
    },
    sub_area: {
      type: Sequelize.DataTypes.STRING,
    },
    donjon_name: {
      type: Sequelize.DataTypes.STRING,
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
    },
    max_players: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: "public",
    },
    tag_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "tags", key: "id" },
      onDelete: "CASCADE",
    },
    user_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    server_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "servers", key: "id" },
      onDelete: "CASCADE",
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
  });

  await queryInterface.createTable("characters", {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    alignment: {
      type: Sequelize.DataTypes.STRING,
    },
    stuff: {
      type: Sequelize.DataTypes.STRING,
    },
    default_character: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    user_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    server_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "servers", key: "id" },
      onDelete: "CASCADE",
    },
    breed_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "breeds", key: "id" },
      onDelete: "CASCADE",
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
  });

  await queryInterface.createTable("event_team", {
    event_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "events", key: "id" },
      onDelete: "CASCADE",
      primaryKey: true,
    },
    character_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "characters", key: "id" },
      onDelete: "CASCADE",
      primaryKey: true,
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    },
  });

  await queryInterface.createTable("comments", {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    event_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: "events", key: "id" },
      onDelete: "CASCADE",
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("comments");
  await queryInterface.dropTable("characters");
  await queryInterface.dropTable("events");
  await queryInterface.dropTable("users");
  await queryInterface.dropTable("tags");
  await queryInterface.dropTable("breeds");
  await queryInterface.dropTable("servers");
}
