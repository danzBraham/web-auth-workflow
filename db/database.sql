CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE role AS ENUM ('admin', 'user');

CREATE TABLE users (
  user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(70) NOT NULL,
  password_token VARCHAR(255),
  password_token_expiration_date TIMESTAMP WITH TIME ZONE,
  role role NOT NULL,
  verification_token VARCHAR(90),
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  verified TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tokens (
  token_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT NULL,
  refresh_token VARCHAR(90) NOT NULL,
  ip INET NOT NULL,
  user_agent VARCHAR(255) NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
