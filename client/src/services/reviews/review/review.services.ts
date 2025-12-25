// Defino el servicio para la reseñas de los cursos
import { LIST_CONSTANTS } from "../../../utils/constants/constant.utils";
import type { CreateReview } from "../../../interfaces";

export class ServiceReviews{
    // Servicio para obtener todas las reseñas de un curso por su ID
    getReviewsByCourseId = async(courseId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/reviews/course/${courseId}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.reviews
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para crear una nueva reseña para un curso
    createReview = async(reviewData: CreateReview) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/reviews/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.review
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para obtener una reseña por su ID
    getReviewById = async(reviewId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/reviews/review/${reviewId}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.review
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para actualizar una reseña por su ID
    updateReview = async(reviewId: number, reviewData: Partial<CreateReview>) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/reviews/review/${reviewId}/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para eliminar una reseña por su ID
    deleteReview = async(reviewId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/reviews/review/${reviewId}/delete`, {
                method: 'DELETE'
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }
}