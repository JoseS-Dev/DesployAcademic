import {z} from "zod";

// Defino el esquema de validación para las reseñas de un curso
const SchemaReview = z.object({
    course_id: z.number().int().positive(),
    user_id: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
    title_review: z.string().min(5).max(100),
    comment_review: z.string().min(10).max(1000)
});

// Función que valida los datos de una reseña de un curso
export function validateReviewData(reviewData){
    if(!reviewData) throw new Error("No review data provided");
    return SchemaReview.safeParse(reviewData);
}

// Función que valida los datos de una reseña de un curso para actualizaciones
export function validateReviewUpdateData(reviewData){
    if(!reviewData) throw new Error("No review data provided");
    return SchemaReview.partial().safeParse(reviewData);
}