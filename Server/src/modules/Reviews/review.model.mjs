import { WithDBConnection } from "../../core/utils/function.mjs";
import { db } from "../../../database/db.mjs";

// Modelo que interatúa con la tabla reviews_course de la base de datos
export class ReviewModel {
    // Método para obtener todas las reseñas de un curso
    static getReviewsByCourseId = WithDBConnection(async (courseId) => {
        if(!courseId) return {error: "El ID del curso es requerido"};
        // Se verifica si existe el curso
        const existingCourse = await db.query(
            `SELECT * FROM courses WHERE id = $1`,
            [courseId]
        );
        if(existingCourse.rowCount === 0) return {error: "El curso no existe"};
        // Si existe, se obtienen las reseñas asociadas al curso
        const reviews = await db.query(
            `SELECT * FROM reviews_course WHERE course_id = $1`,
            [courseId]
        );
        if(reviews.rowCount === 0) return {error: "No se encontraron reseñas para este curso"};
        return {
            message: "Reseñas obtenidas exitosamente",
            reviews: reviews.rows
        }
    });

    // Método para obtener una reseña por su ID
    static getReviewById = WithDBConnection(async (reviewId) => {
        if(!reviewId) return {error: "El ID de la reseña es requerido"};
        // Se verifica si existe la reseña
        const existingReview = await db.query(
            `SELECT * FROM reviews_course WHERE id = $1`,
            [reviewId]
        );
        if(existingReview.rowCount === 0) return {error: "La reseña no existe"};
        return {
            message: "Reseña obtenida exitosamente",
            review: existingReview.rows[0]
        }
    });

    // Método para obtener todas las reseñas según su calificación
    static getReviewsByRating = WithDBConnection(async (courseId, rating) => {
        if(!courseId || !rating) return {error: "El ID del curso y la calificación son requeridos"};
        // Se verifica si existe el curso
        const existingCourse = await db.query(
            `SELECT * FROM courses WHERE id = $1`,
            [courseId]
        );
        if(existingCourse.rowCount === 0) return {error: "El curso no existe"};
        // Si existe, se obtienen las reseñas asociadas al curso con la calificación especificada
        const reviews = await db.query(
            `SELECT * FROM reviews_course WHERE course_id = $1 AND rating = $2`,
            [courseId, rating]
        );
        if(reviews.rowCount === 0) return {error: "No se encontraron reseñas para este curso con la calificación especificada"};
        return {
            message: "Reseñas obtenidas exitosamente",
            reviews: reviews.rows
        }
    })

    // Método para crear una nueva reseña de un curso
    static createReview = WithDBConnection(async (reviewData) => {
        if(!reviewData) return {error: "Los datos de la reseña son requeridos"};
        const {course_id, user_id, ...rest} = reviewData;
        // Se verifica si existe el curso y el usuario que hace la reseña
        const existingCourse = await db.query(
            `SELECT * FROM courses WHERE id = $1`,
            [course_id]
        );
        const existingUser = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [user_id]
        );
        if(existingCourse.rowCount === 0 || existingUser.rowCount === 0){
            return {error: "El curso o el usuario no existen"};
        }
        // Si existen, se crea la reseña
        const newReview = await db.query(
            `INSERT INTO reviews_course (course_id, user_id, rating, title_review, comment_review)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                course_id, user_id, 
                rest.rating, rest.title_review, 
                rest.comment_review
            ]
        );
        if(newReview.rowCount === 0) return {error: "No se pudo crear la reseña"};
        return {
            message: "Reseña creada exitosamente",
            review: newReview.rows[0]
        }
    });

    // Método para actualizar una reseña de un curso
    static updateReview = WithDBConnection(async (reviewId, dataUpdate) => {
        if(!reviewId || !dataUpdate) return {error: "El ID de la reseña y los datos a actualizar son requeridos"};
        const allowedFields = ['rating', 'title_review', 'comment_review'];
        const fielsToUpdate = {};
        for(const field of allowedFields){
            if(dataUpdate[field] !== undefined){
                fielsToUpdate[field] = dataUpdate[field];
            }
        }
        // Se verifica si existe la reseña
        const existingReview = await db.query(
            `SELECT * FROM reviews_course WHERE id = $1 AND user_id = $2`,
            [reviewId, dataUpdate.user_id]
        );
        if(existingReview.rowCount === 0) return {error: "La reseña no existe"};
        // Si existe, se procede a actualizarla
        const fields = [];
        const values = [];

        Object.entries(fielsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        });
        values.push(reviewId);
        const updateReview = await db.query(
            `UPDATE reviews_course SET ${fields.join(', ')} WHERE id = $${values.length}`,
            values
        );
        if(updateReview.rowCount === 0) return {error: "No se pudo actualizar la reseña"};
        return {
            message: "Reseña actualizada exitosamente"
        }
    });

    // Método para eliminar una reseña de un curso
    static deleteReview = WithDBConnection(async (reviewId, userId) => {
        if(!reviewId || !userId) return {error: "El ID de la reseña y el ID del usuario son requeridos"};
        // Se verifica si existe la reseña
        const existingReview = await db.query(
            `SELECT * FROM reviews_course WHERE id = $1 AND user_id = $2`,
            [reviewId, userId]
        );
        if(existingReview.rowCount === 0) return {error: "La reseña no existe"};
        // Si existe, se procede a eliminarla
        const deleteReview = await db.query(
            `DELETE FROM reviews_course WHERE id = $1`,
            [reviewId]
        );
        if(deleteReview.rowCount === 0) return {error: "No se pudo eliminar la reseña"};
        return {
            message: "Reseña eliminada exitosamente"
        }
    });
}