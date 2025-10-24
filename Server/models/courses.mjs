import slugify from 'slugify';
import { db } from '../database/db.mjs';
import { WithDBConnection } from '../utils.mjs';



export class ModelCourses {
    // método que obtiene todos los cursos disponibles
    static getAllCourses = WithDBConnection(async () => {
        const courses = await db.query(`SELECT c.*, COUNT(ci.instructor_id) AS total_instructors
       FROM courses c
       LEFT JOIN course_instructors ci ON c.id = ci.course_id
       GROUP BY c.id`);
        return { courses: courses.rows };
    });

    // método que obtiene un curso por su ID
    static getCourseById = WithDBConnection(async ({ courseId }) => {
        if (!courseId) return { error: 'No se proporcionó un ID de curso' };
        const course = await db.query(`SELECT c.*, COUNT(ci.instructor_id) AS total_instructors
       FROM courses c
       LEFT JOIN course_instructors ci ON c.id = ci.course_id
        WHERE c.id = $1
       GROUP BY c.id `, [courseId]);
        if (course.rowCount === 0) return { error: 'No se encontró el curso' };
        return { course: course.rows[0] };
    });

    // método que obtiene un curso por su slug
    static getCourseBySlug = WithDBConnection(async ({ courseSlug }) => {
        if (!courseSlug) return { error: 'No se proporcionó un slug de curso' };
        const course = await db.query(`SELECT c.*, COUNT(ci.instructor_id) AS total_instructors
         FROM courses c
            LEFT JOIN course_instructors ci ON c.id = ci.course_id
            WHERE c.slug = $1
            GROUP BY c.id `, [courseSlug]);
        if (course.rowCount === 0) return { error: 'No se encontró el curso' };
        return { course: course.rows[0] };
    });

    // metodo que obtiene los cursos publicados
    static getPublishedCourses = WithDBConnection(async () => {
        const courses = await db.query(`SELECT c.*, COUNT(ci.instructor_id) AS total_instructors
       FROM courses c
       LEFT JOIN course_instructors ci ON c.id = ci.course_id
         WHERE c.is_published = TRUE
         GROUP BY c.id`);
        if (courses.rowCount === 0) return { error: 'No se encontraron cursos publicados' };
        return { courses: courses.rows };
    })

    // método que crea un nuevo curso
    static createCourse = WithDBConnection(async ({ courseData }) => {
        if (!courseData) return { error: 'No se proporcionaron datos del curso' };
        //verificar
        const { title, slug, descrption, short_description, price, level, course_type, duration_hours, thumbnail_url,
            preview_video_url } = courseData;
        // Generar slug si no se proporciona
        const courseSlug = slug || slugify(title, { lower: true, strict: true });
        // Verificar si ya existe un curso con ese slug
        const newCourse = await db.query(
            `INSERT INTO courses (title, slug, descrption, short_description, price, level, course_type, duration_hours, thumbnail_url, preview_video_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING title, slug, descrption, short_description, price, level, course_type, duration_hours, thumbnail_url, preview_video_url`,
            [title, courseSlug, descrption, short_description, price, level, course_type, duration_hours, thumbnail_url,
                preview_video_url]
        );
        //ahora se relaciona 

        if (newCourse.rowCount === 0) return { error: 'No se pudo crear el curso' };
        return { course: newCourse.rows[0], message: 'Curso creado exitosamente' };
    }
    );

    // método que actualiza un curso por su ID

    static updateCourse = WithDBConnection(async ({ courseId, updateData }) => {
        if (!courseId) return { error: 'No se proporcionó un ID de curso' };
        if (!updateData || Object.keys(updateData).length === 0)
            return { error: 'No se proporcionaron datos para actualizar' };

        // Genero dinámicamente el SET para SQL
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

        const query = `UPDATE courses SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`;
        const result = await db.query(query, [...values, courseId]);

        if (result.rowCount === 0) return { error: 'No se encontró el curso' };
        return { course: result.rows[0], message: 'Curso actualizado exitosamente' };
    });

    // método que elimina un curso por su ID
    static deleteCourse = WithDBConnection(async ({ courseId }) => {
        if (!courseId) return { error: 'No se proporcionó un ID de curso' };
        const deletedCourse = await db.query('DELETE FROM courses WHERE id = $1 RETURNING *', [courseId]);
        if (deletedCourse.rowCount === 0) return { error: 'No se encontró el curso' };
        return { message: 'Curso eliminado exitosamente' };
    });


}