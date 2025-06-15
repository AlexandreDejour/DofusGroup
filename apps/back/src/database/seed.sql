BEGIN TRANSACTION;

INSERT INTO tags (name, color, created_at, updated_at) VALUES 
('XP', '#3498db', NOW(), NOW()),
('Donjon', '#c0392b', NOW(), NOW()),
('Drop', '#16a085', NOW(), NOW()),
('Quête', '#9b59b6', NOW(), NOW()),
('AVA', '#f39c12', NOW(), NOW()),
('Percepteur', '#2c3e50', NOW(), NOW()),
('Kolizéum', '#f1c40f', NOW(), NOW());

INSERT INTO breeds (name, created_at, updated_at) VALUES
('Cra', NOW(), NOW()),
('Ecaflip', NOW(), NOW()),
('Eliotrope', NOW(), NOW()),
('Enirispa', NOW(), NOW()),
('Enutrof', NOW(), NOW()),
('Feca', NOW(), NOW()),
('Forgelance', NOW(), NOW()),
('Huppermage', NOW(), NOW()),
('Iop', NOW(), NOW()),
('Osamodas', NOW(), NOW()),
('Ouginak', NOW(), NOW()),
('Pandawa', NOW(), NOW()),
('Roublard', NOW(), NOW()),
('Sacrieur', NOW(), NOW()),
('Sadida', NOW(), NOW()),
('Sram', NOW(), NOW()),
('Steamer', NOW(), NOW()),
('Xélor', NOW(), NOW()),
('Zobal', NOW(), NOW());

INSERT INTO servers (name, mono_account, created_at, updated_at) VALUES
('Dakal', true, NOW(), NOW()),
('Draconiros', true, NOW(), NOW()),
('Kourial', true, NOW(), NOW()),
('Mikhal', true, NOW(), NOW()),
('Brial', false, NOW(), NOW()),
('HellMina', false, NOW(), NOW()),
('Imagiro', false, NOW(), NOW()),
('Orukam', false, NOW(), NOW()),
('Rafal', false, NOW(), NOW()),
('Salar', false, NOW(), NOW()),
('TalKasha', false, NOW(), NOW()),
('Tylezia', false, NOW(), NOW()),
('Ombre', false, NOW(), NOW());

COMMIT;
