// Defino la interfaz para los recursos de las lecciones
export interface ResourceData {
    id: number;
    lesson_id: number;
    title_resource: string;
    file_url: string;
    file_type: string;
    file_size: number;
    downloadable: boolean;
}

// Defino la interfaz para la creación de un recurso de lección
export interface CreateResource {
    lesson_id: number;
    title_resource: string;
    file_url: string;
    file_type: string;
    file_size: number;
}