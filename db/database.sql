CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE user_roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(30) UNIQUE NOT NULL
);

INSERT INTO user_roles (role_name)
VALUES ('admin'), ('user');

CREATE TABLE users (
  user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(70),
  password_token VARCHAR(255),
  password_token_expiration_date TIMESTAMP WITH TIME ZONE,
  role_id INT REFERENCES user_roles(role_id) ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL,
  verification_token VARCHAR(90),
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  verified TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE tokens (
  token_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
  refresh_token VARCHAR(90) NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE oauth_providers (
  provider_id SERIAL PRIMARY KEY,
  provider_name VARCHAR(20) UNIQUE NOT NULL
);

INSERT INTO oauth_providers (provider_name)
VALUES ('google'), ('facebook'), ('twitter');

CREATE TABLE user_oauth_accounts (
  account_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
  provider_id INT REFERENCES oauth_providers(provider_id) ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

DROP TABLE user_oauth_accounts;
DROP TABLE oauth_providers;
DROP TABLE tokens;
DROP TABLE users;
DROP TABLE user_roles;
