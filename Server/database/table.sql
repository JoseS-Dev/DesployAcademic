CREATE TYPE user_role AS ENUM('student', 'admin', 'instructor');

-- Tabla de usuarios
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	name_user VARCHAR(125) NOT NULL,
	email_user VARCHAR(125) UNIQUE NOT NULL,
	password_user VARCHAR(100) NOT NULL,
	phone_user VARCHAR(100),
	username VARCHAR(120) NOT NULL UNIQUE,
	date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	avatar_imagen VARCHAR(255)
);

-- Tabla de roles de usuario
CREATE TABLE roles(
	id SERIAL PRIMARY KEY,
	user_id INT,
	role_user user_role NOT NULL DEFAULT('student'),
	assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla del login del usuario
CREATE TABLE login_sessions(
	id SERIAL PRIMARY KEY,
	user_id INT,
	is_active BOOLEAN DEFAULT(TRUE),
	login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	logout_at TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);