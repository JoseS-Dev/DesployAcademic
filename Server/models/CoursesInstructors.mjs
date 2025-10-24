import { db } from "../database/db.mjs";
import { WithDBConnection } from '../utils.mjs';

export class ModelCoursesInstructors {
    // método que asigna un instructor a un curso
    static assignInstructorToCourse = WithDBConnection(async ({ courseId, instructorId }) => {
        if (!courseId || !instructorId) return { error: 'Faltan datos necesarios para asignar el instructor al curso' };
        // Verificar si la asignación ya existe
        const existingAssignment = await db.query(`SELECT * FROM course_instructors WHERE course_id = $1 AND instructor_id = $2`, [courseId, instructorId]);
        if (existingAssignment.rowCount > 0) return { error: 'El instructor ya está asignado a este curso' };
        // Realizar la asignación
        await db.query(`INSERT INTO course_instructors (course_id, instructor_id) VALUES ($1, $2)`, [courseId, instructorId]);
        return { message: 'Instructor asignado al curso exitosamente' };
    });

    // método que remueve un instructor de un curso
    static removeInstructorFromCourse = WithDBConnection(async ({ courseId, instructorId }) => {
        if (!courseId || !instructorId) return { error: 'Faltan datos necesarios para remover el instructor del curso' };
        // Verificar si la asignación existe
        const existingAssignment = await db.query(`SELECT * FROM course_instructors WHERE course_id = $1 AND instructor_id = $2`, [courseId, instructorId]);
        if (existingAssignment.rowCount === 0) return { error: 'El instructor no está asignado a este curso' };
        // Remover la asignación
        await db.query(`DELETE FROM course_instructors WHERE course_id = $1 AND instructor_id = $2`, [courseId, instructorId]);
        return { message: 'Instructor removido del curso exitosamente' };
    });

    //metodo que establece a un instructor como principal en un curso
    static setPrimaryInstructor = WithDBConnection(async ({ courseId, instructorId }) => {
        if (!courseId || !instructorId) return { error: 'Faltan datos necesarios para establecer el instructor principal del curso' };
        // Actualizar todos los instructores del curso para que no sean principales
        await db.query(`UPDATE course_instructors SET is_primary = FALSE WHERE course_id = $1`, [courseId]);
        // Establecer el instructor especificado como principal
        await db.query(`UPDATE course_instructors SET is_primary = TRUE WHERE course_id = $1 AND instructor_id = $2`, [courseId, instructorId]);
        return { message: 'Instructor establecido como principal exitosamente' };
    });

    // método que obtiene los instructores de un curso
    static getInstructorsByCourse = WithDBConnection(async ({ courseId }) => {
        if (!courseId) return { error: 'No se proporcionó un ID de curso' };
        const instructors = await db.query(`
            SELECT i.*, ci.is_primary
            FROM instructors i
            JOIN course_instructors ci ON i.id = ci.instructor_id
            WHERE ci.course_id = $1
        `, [courseId]);
        return { instructors: instructors.rows };
    })

    // método que obtiene los cursos de un instructor
    static getCoursesByInstructor = WithDBConnection(async ({ instructorId }) => {
        if (!instructorId) return { error: 'No se proporcionó un ID de instructor' };
        const courses = await db.query(`
            SELECT c.*, ci.is_primary
            FROM courses c
            JOIN course_instructors ci ON c.id = ci.course_id
            WHERE ci.instructor_id = $1
        `, [instructorId]);
        return { courses: courses.rows };
    })
}