-- AutoLeads CRM — Database Schema
-- This script runs once when PostgreSQL container is first initialized

CREATE TABLE IF NOT EXISTS consultas (
    id               SERIAL PRIMARY KEY,
    fecha            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    canal            VARCHAR(50)  NOT NULL,
    modelo           VARCHAR(100) NOT NULL,
    nombre_cliente   VARCHAR(200) NOT NULL,
    telefono         VARCHAR(30)  NOT NULL,
    ciudad           VARCHAR(100),
    asesor_asignado  VARCHAR(100) NOT NULL,
    observaciones    TEXT
);

-- Index for common filter columns
CREATE INDEX IF NOT EXISTS idx_consultas_canal          ON consultas(canal);
CREATE INDEX IF NOT EXISTS idx_consultas_asesor         ON consultas(asesor_asignado);
CREATE INDEX IF NOT EXISTS idx_consultas_fecha          ON consultas(fecha DESC);

-- Seed data (matches the mockup screenshots)
INSERT INTO consultas (fecha, canal, modelo, nombre_cliente, telefono, ciudad, asesor_asignado, observaciones)
VALUES
  (NOW() - INTERVAL '2 hours',  'Instagram',    'JOLION H.SUPREME', 'Fabián Davalle',          '341-5061333',  'Rosario',        'Diego',  'Consulta por financiación'),
  (NOW() - INTERVAL '3 hours',  'WhatsApp',     'C31 BOX',          'Cristian López',          '341-6588166',  'Rosario',        'Marcos', 'Interesado en permuta'),
  (NOW() - INTERVAL '1 day',    'Mercado Libre','ORA 03',           'Rebeca Fernández',        '341-7052360',  'Córdoba',        'Diego',  'Quiere probar el vehículo'),
  (NOW() - INTERVAL '1 day',    'WhatsApp',     'H6 Pro Hev',       'Lisandro García',         '3462-636380',  'Venado Tuerto',  'Diego',  'Solicita cotización'),
  (NOW() - INTERVAL '2 days',   'Facebook',     'TANK 300',         'María Sánchez',           '351-4561234',  'Córdoba',        'Laura',  'Pregunta por stock disponible'),
  (NOW() - INTERVAL '3 days',   'Web',          'H6',               'Roberto Giménez',         '011-45678901', 'Buenos Aires',   'Carlos', 'Solicitud de test drive'),
  (NOW() - INTERVAL '4 days',   'Llamado',      'ORA Funky Cat',    'Valentina Torres',        '341-9876543',  'Santa Fe',       'Ana',    'Interesada en financiación 60 cuotas'),
  (NOW() - INTERVAL '5 days',   'Referido',     'JOLION PRO',       'Héctor Morales',          '3462-111222',  'Venado Tuerto',  'Martín', 'Referido por cliente Diego Ríos');
