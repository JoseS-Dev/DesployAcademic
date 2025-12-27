CREATE TYPE user_role AS ENUM('student', 'admin', 'instructor');
CREATE TYPE course_type AS ENUM('free', 'premium');
CREATE TYPE course_level AS ENUM('beginner', 'intermediate', 'advanced');
CREATE TYPE lessons_type AS ENUM('video', 'article', 'quiz');
-- Tabla de usuarios
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	name_user VARCHAR(125) NOT NULL,
	email_user VARCHAR(125) UNIQUE NOT NULL,
	password_user VARCHAR(100) NOT NULL,
	phone_user VARCHAR(100),
	username VARCHAR(120) NOT NULL UNIQUE,
	plan_user VARCHAR(50) DEFAULT 'free',
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

-- Tabla de instructor
CREATE TABLE instructor_profiles(
	id SERIAL PRIMARY KEY,
	user_id INT,
	category_instructor VARCHAR(100),
	description_instructor TEXT,
	profile_picture VARCHAR(255),
	website VARCHAR(255),
	social_links JSONB,
	total_students INTEGER DEFAULT 0,
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de relación intermedia entre usuarios y instructores
CREATE TABLE instructor_followers(
	id SERIAL PRIMARY KEY,
	user_id INT,
	instructor_id INT,
	is_follow BOOLEAN DEFAULT(TRUE),
	following_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	desfollowing_at TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id),
	FOREIGN KEY(instructor_id) REFERENCES instructor_profiles(id)
);

-- Tabla de cursos
CREATE TABLE courses(
	id SERIAL PRIMARY KEY,
	title_course VARCHAR(200) NOT NULL,
	slug_course VARCHAR(200) UNIQUE NOT NULL,
	description_course TEXT NOT NULL,
	short_description VARCHAR(500),
	price_course DECIMAL(10,2) NOT NULL,
	level_course course_level NOT NULL DEFAULT('beginner'),
	type_course course_type NOT NULL DEFAULT('free'),
	duration_course INT NOT NULL, -- duración en minutos
	thumbnail_course VARCHAR(255),
	preview_video VARCHAR(255),
	total_enrollments INT DEFAULT 0,
	is_published BOOLEAN DEFAULT(FALSE),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia entre usuarios y cursos (inscripción)
CREATE TABLE user_courses(
	id SERIAL PRIMARY KEY,
	user_id INT,
	course_id INT,
	enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
);

--Tabla de secciones del curso
CREATE TABLE sections_course(
	id SERIAL PRIMARY KEY,
	course_id INT,
	title_section VARCHAR(255) NOT NULL,
	description_section TEXT,
	section_order INTEGER NOT NULL,
	is_published BOOLEAN DEFAULT(FALSE),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
	UNIQUE(course_id, section_order)
);

-- Tabla de lecciones del curso
CREATE TABLE lessons_course(
	id SERIAL PRIMARY KEY,
	section_id INT,
	title_lesson VARCHAR(255) NOT NULL,
	description_lesson TEXT,
	video_url VARCHAR(255),
	thumbail_url VARCHAR(255),
	lesson_order INTEGER NOT NULL,
	lesson_type lessons_type NOT NULL DEFAULT('video'),
	is_preview BOOLEAN DEFAULT(FALSE),
	is_published BOOLEAN DEFAULT(FALSE),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(section_id) REFERENCES sections_course(id) ON DELETE CASCADE,
	UNIQUE(section_id, lesson_order)

);

-- Tabla de recursos adicionales para lecciones
CREATE TABLE resources_lesson(
	id SERIAL PRIMARY KEY,
	lesson_id INT,
	title_resource VARCHAR(255) NOT NULL,
	file_url VARCHAR(255) NOT NULL,
	file_type VARCHAR(100),
	file_size INT, -- tamaño en KB
	downloadable BOOLEAN DEFAULT(TRUE),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(lesson_id) REFERENCES lessons_course(id) ON DELETE CASCADE
);

-- Tabla de relación entre instructores y cursos
CREATE TABLE instructor_courses(
	id SERIAL PRIMARY KEY,
	instructor_id INT,
	course_id INT,
	assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(instructor_id) REFERENCES instructor_profiles(id) ON DELETE CASCADE,
	FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
	UNIQUE(instructor_id, course_id)
);

-- Tabla de reseñas de cursos
CREATE TABLE reviews_course(
	id SERIAL PRIMARY KEY,
	course_id INT,
	user_id INT,
	rating INT CHECK(rating >= 1 AND rating <= 5),
	title_review VARCHAR(100) NOT NULL,
	comment_review TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(course_id, user_id)
);

-- Tabla de categorias de cursos
CREATE TABLE categories_course(
	id SERIAL PRIMARY KEY,
	name_category VARCHAR(100) NOT NULL,
	slug_category VARCHAR(100) UNIQUE NOT NULL,
	description_category TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación entre cursos y categorias
CREATE TABLE course_categories(
	id SERIAL PRIMARY KEY,
	course_id INT,
	category_id INT,
	assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
	FOREIGN KEY(category_id) REFERENCES categories_course(id) ON DELETE CASCADE,
	UNIQUE(course_id, category_id)
);

-- Tabla de relación para el desarrollo de un usuario en un curso
CREATE TABLE user_course_enrollment(
	id SERIAL PRIMARY KEY,
	user_id INT,
	course_id INT,
	enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	progress_percentage DECIMAL(5,2) DEFAULT 0.00,
	is_completed BOOLEAN DEFAULT(FALSE),
	completed_at TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
	UNIQUE(user_id, course_id)
);