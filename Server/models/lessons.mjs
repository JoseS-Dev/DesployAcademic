import { db } from '../database/db.mjs';
import { WithDBConnection } from '../utils.mjs';
import pkg from 'lodash';

const { omit } = pkg;

export class ModelLessons {
    static createLesson = WithDBConnection(async ({ sectionId, lessonData }) => {
        console.log("Creating lesson in section ID:", sectionId);
        if (!sectionId || !lessonData) {
            return { error: 'Datos incompletos para crear lección' };
        }
        const { title, description, video_url, video_duration, thumbnail_url, lesson_order, lesson_type, is_preview, is_published } = lessonData;
        const newLesson = await db.query(
            `INSERT INTO lessons (section_id, title, description, video_url, 
            video_duration, thumbnail_url, lesson_order, lesson_type, is_preview, is_published) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [
            sectionId, title, description, video_url, video_duration,
            thumbnail_url, lesson_order, lesson_type, is_preview, is_published
        ]
        );
        if (newLesson.rowCount === 0) return { error: 'Error al crear la lección' };
        return { Lesson: omit(newLesson.rows[0], ['id', 'section_id']), message: 'Lección creada correctamente' };
    });

    static getLessonsBySection = WithDBConnection(async ({ sectionId }) => {
        if (!sectionId) {
            return { error: 'ID de curso no proporcionado' };
        }
        const lessons = await db.query(
            `SELECT * FROM lessons WHERE section_id = $1 ORDER BY lesson_order ASC`, [sectionId]
        );
        if (lessons.rowCount === 0) return { error: 'No se encontraron lecciones para este curso' };
        return { lessons: lessons.rows, message: 'Lecciones obtenidas correctamente' };
    });

    // metodo para obtener una lección por su ID
    static getLessonById = WithDBConnection(async ({ lessonId }) => {
        if (!lessonId) {
            return { error: 'ID de lección no proporcionado' };
        }
        const lesson = await db.query(
            `SELECT * FROM lessons WHERE id = $1`, [lessonId]
        );
        if (lesson.rowCount === 0) return { error: 'Lección no encontrada' };
        return { lesson: omit(lesson.rows[0], ['id', 'section_id']), message: 'Lección obtenida correctamente' };
    });

    // metodo para actualizar una lección

    static updateLesson = WithDBConnection(async ({ lessonId, lessonData }) => {
        if (!lessonId || !lessonData) {
            return { error: 'Datos incompletos para actualizar lección' };
        }
        // Construyo la consulta dinámicamente

        //verifico si la lección existe
        const existingLesson = await db.query(
            `SELECT id FROM lessons WHERE id = $1`, [lessonId]
        );

        if (existingLesson.rowCount === 0) return { error: 'Lección no encontrada' };

        const fields = [];
        const values = [];
        let index = 1;
        for (const key in lessonData) {
            fields.push(`${key} = $${index}`);
            values.push(lessonData[key]);
            index++;
        }
        values.push(lessonId); // para la cláusula WHERE
        const updateQuery = `UPDATE lessons SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
        const updatedLesson = await db.query(updateQuery, values);
        if (updatedLesson.rowCount === 0) return { error: 'Error al actualizar la lección' };
        return { lesson: omit(updatedLesson.rows[0], ['id', 'section_id']), message: 'Lección actualizada correctamente' };
    });

    static deleteLesson = WithDBConnection(async ({ lessonId }) => {
        if (!lessonId) {
            return { error: 'ID de lección no proporcionado' };
        }

        //verifico si la lección existe
        const existingLesson = await db.query(
            `SELECT id FROM lessons WHERE id = $1`, [lessonId]
        );
        if (existingLesson.rowCount === 0) return { error: 'Lección no encontrada' };

        const deletedLesson = await db.query(
            `DELETE FROM lessons WHERE id = $1 RETURNING *`, [lessonId]
        );
        if (deletedLesson.rowCount === 0) return { error: 'Error al eliminar la lección' };
        return { message: 'Lección eliminada correctamente' };
    });

    // método que elimina todas las lecciones de un curso
    static deleteLessonsByCourseId = WithDBConnection(async ({ courseId }) => {
        if (!courseId) return { error: 'No se proporcionó un ID de curso' };
        const deletedLessons = await db.query(
            `DELETE FROM lessons WHERE section_id = $1`,
            [courseId]
        );

        if (deletedLessons.rowCount === 0) return { error: 'No se pudieron eliminar las lecciones del curso' };
        return { message: 'Lecciones del curso eliminadas correctamente' };
    });


}
