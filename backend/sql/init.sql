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
