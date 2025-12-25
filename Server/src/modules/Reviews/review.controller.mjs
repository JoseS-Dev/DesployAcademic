import { validateReviewData, validateReviewUpdateData } from "./review.schema.mjs";

// Controlador que maneja las operaciones relacionadas con las reseñas de los cursos
export class ReviewController {
    constructor({ReviewModel}){
        this.ReviewModel = ReviewModel;
    }
    // Controlador para obtener todas las reseñas de un curso
    getReviewsByCourseId = async (req, res) => {
        const {courseId} = req.params;
        try{
            const result = await this.ReviewModel.getReviewsByCourseId(Number(courseId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                reviews: result.reviews
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para obtener una reseña por su ID
    getReviewById  = async (req, res) => {
        const {reviewId} = req.params;
        try{
            const result = await this.ReviewModel.getReviewById(Number(reviewId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                review: result.review
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para obtener todas las reseñas según su calificación
    getReviewsByRating = async (req, res) => {
        const {courseId, rating} = req.params;
        try{
            const result = await this.ReviewModel.getReviewsByRating(Number(courseId), Number(rating));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                reviews: result.reviews
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para crear una nueva reseña de un curso
    createReview = async (req, res) => {
        const validation = validateReviewData(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                });
            }
            const result = await this.ReviewModel.createReview(validation.data);
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(201).json({
                message: result.message,
                review: result.review
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para actualizar una reseña de un curso
    updateReview = async (req, res) => {
        const {reviewId} = req.params;
        const validation = validateReviewUpdateData(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                });
            }
            const result = await this.ReviewModel.updateReview(Number(reviewId), validation.data);
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para eliminar una reseña de un curso
    deleteReview = async (req, res) => {
        const {reviewId, userId} = req.params;
        try{
            const result = await this.ReviewModel.deleteReview(Number(reviewId), Number(userId));
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }
}