CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');

CREATE TABLE users(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_user VARCHAR(125) NOT NULL,
    email_user VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_user VARCHAR(20),   
    username VARCHAR(50) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    bio TEXT,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla user_roles
CREATE TABLE user_roles(
    user_id UUID NOT NULL,
    role user_role NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, role),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla login_sessions
CREATE TABLE login_sessions(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_token VARCHAR(500) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)