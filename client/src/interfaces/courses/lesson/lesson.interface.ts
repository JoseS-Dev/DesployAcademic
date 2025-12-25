// Defino la interfaz para las lecciones de las secciones de los cursos
export interface LessonData {
    id: number;
    section_id: number;
    title_lesson: string;
    description_lesson: string;
    video_url: string;
    thumbail_url: string;
    lesson_order: number;
    lesson_type: string;
    is_preview: boolean;
    is_published: boolean;
}

// Defino la interfaz para la creación de una lección de una sección de un curso
export interface CreateLesson {
    section_id: number;
    title_lesson: string;
    description_lesson: string;
    video_url: string;
    thumbail_url: string;
    lesson_order: number;
    lesson_type: string;
}