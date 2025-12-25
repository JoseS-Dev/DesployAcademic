// Defino la interfaz para las reseñas a los cursos por parte de los usuarios
export interface ReviewData {
    id: number;
    course_id: number;
    user_id: number;
    rating: number;
    title_review: string;
    comment_review: string;
    created_at: string;
}

// Defino la interfaz para la creación de una reseña a un curso
export interface CreateReview {
    course_id: number;
    user_id: number;
    rating: number;
    title_review: string;
    comment_review: string;
}