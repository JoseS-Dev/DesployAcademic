// Defino la interfaz para los datos del usuario
export interface UserData {
    id: number;
    name_user: string;
    email_user: string;
    password_user: string;
    username: string;
    plan_user: string;
    phone_user?: string;
    date_joined: string;
    avatar_imagen?: string;
}

// Defino la interfaz para el registro de usuarios
export interface RegisterUser {
    name_user: string;
    email_user: string;
    password_user: string;
    username: string;
    rol_user: string;
}

// Defino la interfaz para el inicio de sesión de usuarios
export interface LoginUser {
    email_user: string;
    password_user: string;
}

// Defino la interfaz para la tabla de realción del desarrollo de un usuario en un curso
export interface UserCourseProgress {
    id: number;
    user_id: number;
    course_id: number;
    enrolled_at: string;
    progress_percentage: number;
    is_completed: boolean;
    completed_at?: string;
}

// Defino la interfaz para la actualización del progreso de un usuario en un curso
export interface UpdateUserCourseProgress {
    user_id: number;
    course_id: number;
    progress_percentage: number;
}