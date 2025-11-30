import { WithDBConnection } from "../../../../core/utils/function.mjs";
import {db} from "../../../../../database/db.mjs";

// Modelo que interectúa con la tabla lessons_course de la base de datos
export class ModelLessonCourse {
    // Método para obtener todas las lecciones de una sección de un curso
    static getLessonsBySectionId = WithDBConnection(async (sectionId) => {
        if(!sectionId) return {error: "El ID de la sección es requerido"};
        // Se verifica que existan la sección
        const existingSection = await db.query(
            'SELECT * FROM sections_course WHERE id = $1',
            [sectionId]
        );
        if(existingSection.rowCount === 0) return {error: "La sección no existe"};
        // Si existe, se obtienen las lecciones de la sección
        const lessons = await db.query(
            `SELECT * FROM lessons_course WHERE section_id = $1 ORDER BY lesson_order ASC`,
            [sectionId]
        );
        if(lessons.rowCount === 0) return {error: "No hay lecciones en esta sección"};
        return {
            message: "Lecciones obtenidas correctamente",
            lessons: lessons.rows
        }
    });

    // Método para obtener una lección por su ID
    static getLessonById = WithDBConnection(async (lessonId) => {
        if(!lessonId) return {error: "El ID de la lección es requerido"};
        // Se verifica que exista la lección
        const existingLesson = await db.query(
            `SELECT * FROM lessons_course WHERE id = $1`,
            [lessonId]
        );
        if(existingLesson.rowCount === 0) return {error: "La lección no existe"};
        return {
            message: "Lección obtenida correctamente",
            lesson: existingLesson.rows[0]
        }
    });

    // Método que obtiene las lecciones que son gratis de una sección
    static getFreeLessonsBySectionId = WithDBConnection(async (sectionId) => {
        if(!sectionId) return {error: "El ID de la sección es requerido"};
        // Se verifica que existan la sección
        const existingSection = await db.query(
            `SELECT * FROM sections_course WHERE id = $1`,
            [sectionId]
        );
        if(existingSection.rowCount === 0) return {error: "La sección no existe"};
        // Si existe, se obtienen las lecciones gratuitas de la sección
        const lessons = await db.query(
            'SELECT * FROM lessons_course WHERE section_id = $1 AND is_preview = TRUE ORDER BY lesson_order ASC',
            [sectionId]
        );
        if(lessons.rowCount === 0) return {error: "No hay lecciones gratuitas en esta sección"};
        return {
            message: "Lecciones gratuitas obtenidas correctamente",
            lessons: lessons.rows
        }
    });

    // Método para cambiar el estado de publicación de una lección
    static toggleLessonPublication = WithDBConnection(async (lessonId, newStatus) => {
        if(!lessonId) return {error: "El ID de la lección es requerido"};
        if(typeof newStatus !== 'boolean') return {error: "El nuevo estado de publicación debe ser un booleano"};
        // Se verifica que exista la lección
        const existingLesson = await db.query(
            `SELECT * FROM lessons_course WHERE id = $1`,
            [lessonId]
        );
        if(existingLesson.rowCount === 0) return {error: "La lección no existe"};
        // Si existe, se actualiza su estado de publicación
        const updatedLesson = await db.query(
            `UPDATE lessons_course SET is_published = $1 WHERE id = $2`,
            [newStatus, lessonId]
        );
        if(updatedLesson.rowCount === 0) return {error: "No se pudo actualizar el estado de la lección"};
        return {
            message: "Estado de la lección actualizado correctamente"
        }
    });

    // Método para cambiar el estado de vista previa de una lección
    static toggleLessonPreview = WithDBConnection(async (lessonId, newStatus) => {
        if(!lessonId) return {error: "El ID de la lección es requerido"};
        if(typeof newStatus !== 'boolean') return {error: "El nuevo estado de vista previa debe ser un booleano"};
        // Se verifica que exista la lección
        const existingLesson = await db.query(
            `SELECT * FROM lessons_course WHERE id = $1`,
            [lessonId]
        );
        if(existingLesson.rowCount === 0) return {error: "La lección no existe"};
        // Si existe, se actualiza su estado de vista previa
        const updatedLesson = await db.query(
            `UPDATE lessons_course SET is_preview = $1 WHERE id = $2`,
            [newStatus, lessonId]
        );
        if(updatedLesson.rowCount === 0) return {error: "No se pudo actualizar el estado de vista previa de la lección"};
        return {
            message: "Estado de vista previa de la lección actualizado correctamente"
        }
    });

    // Método para obtener las lecciones de una sección que según su tipo
    static getLessonsByType = WithDBConnection(async (sectionId, lessonType) => {
        if(!sectionId || !lessonType) return {error: "El ID de la sección y el tipo de lección son requeridos"};
        // Se verifica que existan la sección
        const existingSection = await db.query(
            'SELECT * FROM sections_course WHERE id = $1',
            [sectionId]
        );
        if(existingSection.rowCount === 0) return {error: "La sección no existe"};
        // Se obtienen las lecciones del tipo especificado
        const lessons = await db.query(
            `SELECT * FROM lessons_course WHERE section_id = $1 AND lesson_type = $2 ORDER BY lesson_order ASC`,
            [sectionId, lessonType]
        );
        if(lessons.rowCount === 0) return {error: `No hay lecciones de tipo ${lessonType} en esta sección`};
        return {
            message: "Lecciones obtenidas correctamente",
            lessons: lessons.rows
        }
    });

    // Método para crear una nueva lección en una sección
    static createLessonCourse = WithDBConnection(async (lessonData) => {
        if(!lessonData) return {error: "Los datos de la lección son requeridos"};
        const {section_id, ...restData} = lessonData;
        // Se verifica que exista la sección
        const existingSection = await db.query(
            `SELECT * FROM sections_course WHERE id = $1`,
            [section_id]
        );
        if(existingSection.rowCount === 0) return {error: "La sección no existe"};
        // Además, se verifica que no haya una lección con el mismo título en la misma sección
        const existingLesson = await db.query(
            `SELECT * FROM lessons_course WHERE section_id = $1 AND title_lesson = $2`,
            [section_id, restData.title_lesson]
        );
        if(existingLesson.rowCount > 0) return {error: "Ya existe una lección con ese título en esta sección"};
        // Si no existe, se crea la nueva lección
        const newLesson = await db.query(
            `INSERT INTO lessons_course (section_id, title_lesson, description_lesson, video_url,
             thumbail_url, lesson_order, lesson_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
             [
                section_id, restData.title_lesson,
                restData.description_lesson,
                restData.video_url, restData.thumbail_url,
                restData.lesson_order, restData.lesson_type
             ]
        );
        if(newLesson.rowCount === 0) return {error: "No se pudo crear la lección"};
        return {
            message: "Lección creada correctamente",
            lesson: newLesson.rows[0]
        }
    });

    // Método para actualizar una lección de una sección
    static updateLessonCourse = WithDBConnection(async (lessonId, lessonData) => {
        if(!lessonId || !lessonData) return {error: "El ID de la lección y los datos son requeridos"};
        const allowedFields = [
            'title_lesson', 'description_lesson', 'video_url',
            'thumbail_url', 'lesson_order', 'lesson_type'
        ];
        const fieldsToUpdate = {};
        for(const field of allowedFields){
            if(lessonData[field] !== undefined){
                fieldsToUpdate[field] = lessonData[field];
            }
        };
        // Se verifica que exista la lección
        const existingLesson = await db.query(
            `SELECT * FROM lessons_course WHERE id = $1`,
            [lessonId]
        );
        if(existingLesson.rowCount === 0) return {error: "La lección no existe"};
        // Si existe, se actualizan los campos proporcionados
        const fields = [];
        const values = [];

        Object.keys(fieldsToUpdate).forEach((field, index) => {
            fields.push(`${field} = $${index + 1}`);
            values.push(fieldsToUpdate[field]);
        });
        values.push(lessonId);
        const updatedLesson = await db.query(
            `UPDATE lessons_course SET ${fields.join(', ')} WHERE id = $${values.length}`,
            values
        );
        if(updatedLesson.rowCount === 0) return {error: "No se pudo actualizar la lección"};
        return {
            message: "Lección actualizada correctamente"
        }
    });

    // Método para eliminar una lección de una sección
    static deleteLessonCourse = WithDBConnection(async (lessonId) => {
        if(!lessonId) return {error: "El ID de la lección es requerido"};
        // Se verifica que exista la lección
        const existingLesson = await db.query(
            `SELECT * FROM lessons_course WHERE id = $1`,
            [lessonId]
        );
        if(existingLesson.rowCount === 0) return {error: "La lección no existe"};
        // Si existe, se procede a eliminarla
        const deletedLesson = await db.query(
            `DELETE FROM lessons_course WHERE id = $1`,
            [lessonId]
        );
        if(deletedLesson.rowCount === 0) return {error: "No se pudo eliminar la lección"};
        // A su vez se modifica el orden de las demás lecciones de la sección
        await db.query(
            `UPDATE lessons_course SET lesson_order = lesson_order - 1 WHERE section_id = $1 
            AND lesson_order > $2`,
            [existingLesson.rows[0].section_id, existingLesson.rows[0].lesson_order]
        );
        return {
            message: "Lección eliminada correctamente"
        }
    });
}