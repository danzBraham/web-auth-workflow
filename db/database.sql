CREATE DATABASE cryptonesia_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE role AS ENUM ('admin', 'user');

CREATE TABLE users (
  user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(70) NOT NULL,
  role role,
  verification_token VARCHAR(90),
  is_verified BOOLEAN DEFAULT FALSE,
  verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
