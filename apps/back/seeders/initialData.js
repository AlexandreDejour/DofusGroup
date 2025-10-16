"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Tags
  await queryInterface.bulkInsert("tags", [
    {
      id: Sequelize.literal("gen_random_uuid()"),
      name: "XP",
      color: "#3498db",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: Sequelize.literal("gen_random_uuid()"),
      name: "Donjon",
      color: "#c0392b",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: Sequelize.literal("gen_random_uuid()"),
      name: "Drop",
      color: "#077005",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: Sequelize.literal("gen_random_uuid()"),
      name: "Quête",
      color: "#9b59b6",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: Sequelize.literal("gen_random_uuid()"),
      name: "AVA",
      color: "#9C4F07",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: Sequelize.literal("gen_random_uuid()"),
      name: "Percepteur",
      color: "#6D28D9",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: Sequelize.literal("gen_random_uuid()"),
      name: "Kolizéum",
      color: "#273CF5",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Breeds
  const breeds = [
    "Cra",
    "Ecaflip",
    "Eliotrope",
    "Eniripsa",
    "Enutrof",
    "Feca",
    "Forgelance",
    "Huppermage",
    "Iop",
    "Osamodas",
    "Ouginak",
    "Pandawa",
    "Roublard",
    "Sacrieur",
    "Sadida",
    "Sram",
    "Steamer",
    "Xélor",
    "Zobal",
  ].map((name) => ({
    id: Sequelize.literal("gen_random_uuid()"),
    name,
    created_at: new Date(),
    updated_at: new Date(),
  }));
  await queryInterface.bulkInsert("breeds", breeds);

  // Servers
  const servers = [
    { name: "Dakal", mono_account: true },
    { name: "Draconiros", mono_account: true },
    { name: "Kourial", mono_account: true },
    { name: "Mikhal", mono_account: true },
    { name: "Brial", mono_account: false },
    { name: "HellMina", mono_account: false },
    { name: "Imagiro", mono_account: false },
    { name: "Orukam", mono_account: false },
    { name: "Rafal", mono_account: false },
    { name: "Salar", mono_account: false },
    { name: "TalKasha", mono_account: false },
    { name: "Tylezia", mono_account: false },
    { name: "Ombre", mono_account: false },
  ].map((s) => ({
    id: Sequelize.literal("gen_random_uuid()"),
    name: s.name,
    mono_account: s.mono_account,
    created_at: new Date(),
    updated_at: new Date(),
  }));
  await queryInterface.bulkInsert("servers", servers);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("tags", null, { cascade: true });
  await queryInterface.bulkDelete("breeds", null, { cascade: true });
  await queryInterface.bulkDelete("servers", null, { cascade: true });
}
