
import type { CreateReview } from "../../../interfaces";


// Servicio para obtener todas las reseñas de un curso por su ID
export const getReviewsByCourseId = async(courseId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/reviews/course/${courseId}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para crear una nueva reseña para un curso
export const createReview = async(reviewData: CreateReview) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/reviews/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para obtener una reseña por su ID
export const getReviewById = async(reviewId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/reviews/review/${reviewId}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para actualizar una reseña por su ID
export const updateReview = async(reviewId: number, reviewData: Partial<CreateReview>) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/reviews/review/${reviewId}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para eliminar una reseña por su ID
export const deleteReview = async(reviewId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/reviews/review/${reviewId}/delete`, {
            method: 'DELETE'
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
