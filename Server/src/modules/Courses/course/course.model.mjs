import {db} from '../../../../database/db.mjs';
import {WithDBConnection} from '../../../core/utils/function.mjs';
import pkg from 'lodash';

const {omit} = pkg;

// Modelo que interactúa con la tabla courses de la base de datos
export class ModelCourses {
    // Método para obtener todos los cursos de un instructor
    static getCoursesByInstructor = WithDBConnection(async (instructorId) => {
        if(!instructorId) return {error: "El ID del instructor no fue proporcionado"};
        // Se verifica si existe el instructor
        const instructor = await db.query(
            `SELECT * FROM instructor_profiles WHERE id = $1`,
            [instructorId]
        );
        if(instructor.rowCount === 0) return {error: "No se encontró un instructor con ese ID"};
        // Si existe, se obtienen sus cursos
        const courses = await db.query(
            `SELECT C.*, CI.instructor_id FROM courses C
            JOIN instructor_courses CI ON C.id = CI.course_id
            WHERE CI.instructor_id = $1`,
            [instructorId]
        );
        if(courses.rowCount === 0) return {error: "El instructor no tiene cursos asignados"};
        return {
            courses: courses.rows, 
            message: "Cursos obtenidos exitosamente"
        };
    });

    // Método para obtener todos los cursos registrados en el sistema
    static getAllCourses = WithDBConnection(async () => {
        const courses = await db.query( `SELECT * FROM courses`);
        if(courses.rowCount === 0) return {error: "No hay cursos registrados en el sistema"};
        return {
            courses: courses.rows,
            message: "Cursos obtenidos exitosamente"
        }
    });

    // Método para bsucar un curso por su slug
    static getCourseBySlug = WithDBConnection( async(slug) => {
        if(!slug) return {error: "El slug del curso no fue proporcionado"};
        const course = await db.query(
            `SELECT * FROM courses WHERE slug_course = $1`,
            [slug]
        );
        if(course.rowCount === 0) return {error: "No se encontró un curso con ese slug"};
        return {
            course: course.rows[0],
            message: "Curso obtenido exitosamente"
        }
    });

    // Método para buscar un curso según su grado de dificultad
    static getCourseByLevel = WithDBConnection(async(level) => {
        if(!level) return {error: "El nivel del curso no fue proporcionado"};
        const courses = await db.query(
            `SELECT * FROM courses WHERE level_course = $1`,
            [level]
        );
        if(courses.rowCount === 0) return {error: "No se encontraron cursos con ese nivel de dificultad"};
        return {
            courses: courses.rows,
            message: "Cursos obtenidos exitosamente"
        }
    });

    // Método para buscar un curso según su tipo (gratuito o premium)
    static getCourseByType = WithDBConnection(async (type) => {
        if(!type) return {error: "El tipo de curso no fue proporcionado"};
        const courses = await db.query(
            `SELECT * FROM courses WHERE type_course = $1`,
            [type]
        );
        if(courses.rowCount === 0) return {error: "No se encontraron cursos con ese tipo"};
        return {
            courses: courses.rows,
            message: "Cursos obtenidos exitosamente"
        }
    });

    // Método para crear un nuevo curso
    static createCourse = WithDBConnection(async (courseData) => {
        if(!courseData) return {error: "No se proporcionaron datos para el curso"};
        const {instructor_id, ...courseFields} = courseData;
        // Se verifica si el instructor existe
        const instructor = await db.query(
            `SELECT * FROM instructor_profiles WHERE id = $1`,
            [instructor_id]
        );
        if(instructor.rowCount === 0) return {error: "No se encontró un instructor con ese ID"};
        // Se crea el curso
        const newCourse = await db.query(
            `INSERT INTO courses (title_course, slug_course, description_course, short_description, price_course,
            type_course, level_course, duration_course, thumbnail_course, preview_video) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                courseFields.title_course, courseFields.slug_course, courseFields.description_course,
                courseFields.short_description, courseFields.price_course, courseFields.type_course,
                courseFields.level_course, courseFields.duration_course, courseFields.thumbnail_course || null,
                courseFields.preview_video || null
            ]
        );
        if(newCourse.rowCount === 0) return {error: "No se pudo crear el curso"};
        // Una vez creado se relaciona con el instructor
        const relation = await db.query(
            `INSERT INTO instructor_courses (instructor_id, course_id) VALUES ($1, $2)`,
            [instructor_id, newCourse.rows[0].id]
        );
        if(relation.rowCount === 0) return {error: "No se pudo relacionar el curso con el instructor"};
        return {
            course: newCourse.rows[0],
            message: "Curso creado exitosamente"
        }
    });

    // Método para cambiar el estado de un curso (Publicado / No publicado)
    static toggleCourseStatus = WithDBConnection(async (courseId, newStatus) => {
        if(!courseId) return {error: "El ID del curso no fue proporcionado"};
        if(typeof newStatus !== 'boolean') return {error: "El nuevo estado del curso no es válido"};
        // Se verifica si el curso existe
        const existingCourse = await db.query(
            `SELECT * FROM courses WHERE id = $1`,
            [courseId]
        );
        if(existingCourse.rowCount === 0) return {error: "No se encontró un curso con ese ID"};
        // Si existe, se actauliza el is_published
        const updatedCourse = await db.query(
            `UPDATE courses SET is_published = $1 WHERE id = $2`,
            [newStatus, courseId]
        );
        if(updatedCourse.rowCount === 0) return {error: "No se pudo actualizar el estado del curso"};
        return {
            message: "Estado del curso actualizado exitosamente"
        }
    });

    // Método para actualizar la información de un curso
    static updatedCourse = WithDBConnection(async (courseId, updateData) => {
        if(!courseId || !updateData) return {error: "Faltan datos para actualizar el curso"};
        const allowedFields = [
            'title_course', 'slug_course', 'description_course', 'short_description',
            'price_course', 'type_course', 'level_course', 'duration_course', 'thumbnail_course', 'preview_video'
        ];
        const fieldsToUpdate = {};
        for(const field of allowedFields){
            if(updateData[field] !== undefined){
                fieldsToUpdate[field] = updateData[field];
            }
        };

        // Se verifica si existe el curso
        const existingCourse = await db.query(
            `SELECT * FROM courses WHERE id = $1`,
            [courseId]
        );
        if(existingCourse.rowCount === 0) return {error: "No se encontró un curso con ese ID"};
        // Si existe, se prepara la consulta para actaulziar el curso
        const fields = [];
        const values = [];

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        });
        values.push(courseId); // Agrego el courseId al final para la cláusula WHERE
        const updatedCourse = await db.query(
            `UPDATE courses SET ${fields.join(', ')} WHERE id = $${values.length}`,
            values
        );
        if(updatedCourse.rowCount === 0) return {error: "No se pudo actualizar el curso"};
        return {
            message: "Curso actualizado exitosamente"
        }
    });

    // Método para eliminar un curso
    static deleteCourse = WithDBConnection(async (courseId) => {
        if(!courseId) return {error: "El ID del curso no fue proporcionado"};
        // Se verifica si existe el curso
        const existingCourse = await db.query(
            `SELECT * FROM courses WHERE id = $1`,
            [courseId]
        );
        if(existingCourse.rowCount === 0) return {error: "No se encontró un curso con ese ID"};
        // Si existe, se elimina el curso
        const deletedCourse = await db.query(
            `DELETE FROM courses WHERE id = $1`,
            [courseId]
        );
        if(deletedCourse.rowCount === 0) return {error: "No se pudo eliminar el curso"};
        return {
            message: "Curso eliminado exitosamente"
        }
    })
}