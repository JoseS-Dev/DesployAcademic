import {Router} from 'express';
import { ReviewController } from './review.controller.mjs';
import { ReviewModel } from './review.model.mjs';

const router = Router();
const reviewController = new ReviewController({ReviewModel: ReviewModel});

// Rutas para las reseñas de los cursos
// Ruta para obtener todas las reseñas de un curso
router.get('/course/:courseId', reviewController.getReviewsByCourseId);
// Ruta para obtener una reseña por su ID
router.get('/review/:reviewId', reviewController.getReviewById);
// Ruta para obtener todas las reseñas según su calificación
router.get('/course/:courseId/rating/:rating', reviewController.getReviewsByRating);
// Ruta para crear una nueva reseña de un curso
router.post('/create', reviewController.createReview);
// Ruta para actualizar una reseña de un curso
router.patch('/review/:reviewId/update', reviewController.updateReview);
// Ruta para eliminar una reseña de un curso
router.delete('/review/:reviewId/delete', reviewController.deleteReview);

export const reviewRoute = router;