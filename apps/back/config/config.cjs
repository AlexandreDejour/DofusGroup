module.exports = {
  development: {
    url: process.env.PG_URL,
    dialect: "postgres",
  },
  test: {
    url: process.env.PG_URL,
    dialect: "postgres",
  },
  production: {
    url: process.env.PG_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    },
  },
};
