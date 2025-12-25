// Defino la interfaz para los datos de las redes sociales del instructor
export interface SocialLinks {
    plataform: string;
    url: string;
}

// Defino la interfaz de los instructores
export interface InstructorData {
    id: number;
    user_id: number;
    category_instructor: string;
    description_instructor: string;
    profile_picture: string;
    website: string;
    social_links: SocialLinks[];
}

// Defino la interfaz para la creación de un instructor
export interface CreateInstructor {
    user_id: number;
    category_instructor: string;
    description_instructor: string;
    profile_picture: string;
    website: string;
    social_links: SocialLinks[];
}