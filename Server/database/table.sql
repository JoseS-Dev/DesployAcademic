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

-- Tabla instructor_profiles (separada de users)
CREATE TABLE instructor_profiles(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    description TEXT,
    profile_picture VARCHAR(255),
    website VARCHAR(255),
    social_links JSONB,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_students INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla courses 
CREATE TABLE courses(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL, -- Nombre más descriptivo
    slug VARCHAR(300) NOT NULL UNIQUE, -- Para URLs amigables
    description TEXT, -- Más espacio para descripción
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Precios más altos posibles
    level course_level NOT NULL DEFAULT 'beginner',
    course_type course_type NOT NULL DEFAULT 'free',
    duration_hours INTEGER, -- En horas, más manejable
    thumbnail_url VARCHAR(255),
    preview_video_url VARCHAR(255),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE, -- Para moderación
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla course_instructors (relación muchos a muchos)
CREATE TABLE course_instructors(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    instructor_id UUID NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY(instructor_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(course_id, instructor_id)
);