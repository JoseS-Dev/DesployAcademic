// Defino la interfaz para los datos de los cursos
export interface CourseData {
    id: number;
    title_course: string;
    slug_course: string;
    description_course: string;
    short_description: string;
    price_course: number;
    level_course: string;
    type_course: string;
    duration_course: string;
    thumbnail_course: string;
    preview_video: string;
    is_published: boolean;
}

// Defino la interfaz para la creación de un curso
export interface CreateCourse {
    title_course: string;
    slug_course: string;
    description_course: string;
    short_description: string;
    price_course: number;
    level_course: string;
    type_course: string;
    duration_course: string;
    thumbnail_course: string;
    preview_video: string;
}