// Defino la interfaz para los datos de secciones de cursos
export interface SectionData {
    id: number;
    course_id: number;
    title_section: string;
    description_section: string;
    section_order: number;
}

// Defino la interfaz para la creación de una sección de curso
export interface CreateSection {
    course_id: number;
    title_section: string;
    description_section: string;
    section_order: number;
}