BEGIN TRANSACTION;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO tags (id, name, color, created_at, updated_at) VALUES 
(gen_random_uuid(), 'XP', '#3498db', NOW(), NOW()),
(gen_random_uuid(), 'Donjon', '#c0392b', NOW(), NOW()),
(gen_random_uuid(), 'Drop', '#16a085', NOW(), NOW()),
(gen_random_uuid(), 'Quête', '#9b59b6', NOW(), NOW()),
(gen_random_uuid(), 'AVA', '#f39c12', NOW(), NOW()),
(gen_random_uuid(), 'Percepteur', '#6D28D9', NOW(), NOW()),
(gen_random_uuid(), 'Kolizéum', '#f1c40f', NOW(), NOW());

INSERT INTO breeds (id, name, created_at, updated_at) VALUES
(gen_random_uuid(), 'Cra', NOW(), NOW()),
(gen_random_uuid(), 'Ecaflip', NOW(), NOW()),
(gen_random_uuid(), 'Eliotrope', NOW(), NOW()),
(gen_random_uuid(), 'Eniripsa', NOW(), NOW()),
(gen_random_uuid(), 'Enutrof', NOW(), NOW()),
(gen_random_uuid(), 'Feca', NOW(), NOW()),
(gen_random_uuid(), 'Forgelance', NOW(), NOW()),
(gen_random_uuid(), 'Huppermage', NOW(), NOW()),
(gen_random_uuid(), 'Iop', NOW(), NOW()),
(gen_random_uuid(), 'Osamodas', NOW(), NOW()),
(gen_random_uuid(), 'Ouginak', NOW(), NOW()),
(gen_random_uuid(), 'Pandawa', NOW(), NOW()),
(gen_random_uuid(), 'Roublard', NOW(), NOW()),
(gen_random_uuid(), 'Sacrieur', NOW(), NOW()),
(gen_random_uuid(), 'Sadida', NOW(), NOW()),
(gen_random_uuid(), 'Sram', NOW(), NOW()),
(gen_random_uuid(), 'Steamer', NOW(), NOW()),
(gen_random_uuid(), 'Xélor', NOW(), NOW()),
(gen_random_uuid(), 'Zobal', NOW(), NOW());

INSERT INTO servers (id, name, mono_account, created_at, updated_at) VALUES
(gen_random_uuid(), 'Dakal', true, NOW(), NOW()),
(gen_random_uuid(), 'Draconiros', true, NOW(), NOW()),
(gen_random_uuid(), 'Kourial', true, NOW(), NOW()),
(gen_random_uuid(), 'Mikhal', true, NOW(), NOW()),
(gen_random_uuid(), 'Brial', false, NOW(), NOW()),
(gen_random_uuid(), 'HellMina', false, NOW(), NOW()),
(gen_random_uuid(), 'Imagiro', false, NOW(), NOW()),
(gen_random_uuid(), 'Orukam', false, NOW(), NOW()),
(gen_random_uuid(), 'Rafal', false, NOW(), NOW()),
(gen_random_uuid(), 'Salar', false, NOW(), NOW()),
(gen_random_uuid(), 'TalKasha', false, NOW(), NOW()),
(gen_random_uuid(), 'Tylezia', false, NOW(), NOW()),
(gen_random_uuid(), 'Ombre', false, NOW(), NOW());

COMMIT;
