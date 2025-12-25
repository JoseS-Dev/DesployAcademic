// Defino la interfaz para las categorias de los cursos
export interface CategoryData {
    id: number;
    name_category: string;
    slug_category: string;
    description_category: string;
}

// Defino la interfaz para la creación de una categoria de curso
export interface CreateCategory {
    name_category: string;
    slug_category: string;
    description_category: string;
}