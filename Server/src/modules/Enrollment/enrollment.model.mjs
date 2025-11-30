import { WithDBConnection } from "../../core/utils/function.mjs";
import { db } from "../../../database/db.mjs";

// Modelo que interactúa con la tabla user_course_enrollment de la base de datos
export class EnrollmentModel{
    // Método que obtiene a todos los estudiantes inscritos en un curso especifico
    static getEnrollmentsByCourse = WithDBConnection(async(courseId) => {
        if(!courseId) return {error: "El ID del curso no fue proporcionado"};
        // Se verifica si el curso existe
        const existingCourse = await db.query(
            `SELECT * FROM courses WHERE id = $1`,
            [courseId]
        );
        if(existingCourse.rowCount === 0) return {error: "No se encontró un curso con ese ID"};
        // Si existe, se obtienen los estudiantes incritos
        const enrollments = await db.query(
            `SELECT E.*, U.username, U.email_user FROM user_course_enrollment E
            JOIN users U ON e.user_id = U.id WHERE E.course_id = $1`,
            [courseId]
        );
        if(enrollments.rowCount === 0) return {error: "No hay estudiantes inscritos en este curso"};
        return {
            enrollments: enrollments.rows,
            message: "Estudiantes inscritos obtenidos exitosamente"
        }
    });

    // Método que obtiene el progreso de un estudiante en un curso
    static getEnrollmentById = WithDBConnection(async(userId, courseId) => {
        if(!userId || !courseId) return {error: "El ID del usuario o del curso no fue proporcionado"};
        // Se verifica si el estudiante y el curso exista
        const existingUser = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        const existingCourse = await db.query(`SELECT * FROM courses WHERE id = $1`, [courseId]);
        if(existingUser.rowCount === 0 || existingCourse.rowCount === 0){
            return {error: "No se encontró el usuario o el curso con los IDs proporcionados"};
        }
        // Si existe, se obtiene el progreso del estudiante en el curso
        const enrollment = await db.query(
            `SELECT * FROM user_course_enrollment WHERE user_id = $1 AND course_id = $2`,
            [userId, courseId]
        );
        if(enrollment.rowCount === 0) return {error: "El estudiante no está inscrito en este curso"};
        return {
            enrollment: enrollment.rows[0],
            message: "Progreso del estudiante obtenido exitosamente"
        }
    })

    // Método para obtener todos los cursos en los que están inscritos un estudiante
    static getEnrollmentsByUser = WithDBConnection(async(userId) => {
        if(!userId) return {error: "El ID del usuario no fue proporcionado"};
        // Se verifica si existe el usuario
        const existingUser = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );
        if(existingUser.rowCount === 0) return {error: "No se encontró un usuario con ese ID"};
        // Si existe, se obtienen sus incripciones
        const enrollments = await db.query(
            `SELECT E.*, C.title_course, C.short_description FROM user_course_enrollment E
            JOIN courses C ON E.course_id = C.id WHERE E.user_id = $1`,
            [userId]
        );
        if(enrollments.rowCount === 0) return {error: "El usuario no está inscrito en ningún curso"};
        return {
            enrollments: enrollments.rows,
            message: "Cursos inscritos obtenidos exitosamente"
        }
    });

    // Método para cambiar el progreso de un estudiante en un curso
    static updateEnrollmentProgress = WithDBConnection(async(userId, courseId, progressPercentage) => {
        if(!userId || !courseId) return {error: "El ID del usuario o del curso no fue proporcionado"};
        if(progressPercentage === undefined || progressPercentage < 0 || progressPercentage > 100){
            return {error: "El porcentaje de progreso proporcionado no es válido"};
        }
        // Se verifica si el estudiante y el curso existen
        const existingUser = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        const existingCourse = await db.query(`SELECT * FROM courses WHERE id = $1`, [courseId]);
        if(existingUser.rowCount === 0 || existingCourse.rowCount === 0){
            return {error: "No se encontró el usuario o el curso con los IDs proporcionados"};
        }
        // Si existen, se actualiza el progreso del estudiante en el curso
        // Pero, si el progreso es 100%, se actualiza el estado de completado
        if(progressPercentage === 100){
            const updatedEnrollment = await db.query(
                `UPDATE user_course_enrollment SET progress_percentage = $1, is_completed = true,
                completed_at = NOW() WHERE user_id = $2 AND course_id = $3 RETURNING *`,
                [progressPercentage, userId, courseId]
            );
            if(updatedEnrollment.rowCount === 0) return {
                error: "El estudiante no está inscrito en este curso"};
            return {
                message: `El estudainte ${existingUser.rows[0].username} ha completado el curso 
                ${existingCourse.rows[0].title_course} exitosamente`
            }
        }
        const updatedEnrollment = await db.query(
            `UPDATE user_course_enrollment SET progress_percentage = $1
            WHERE user_id = $2 AND course_id = $3 RETURNING *`,
            [progressPercentage, userId, courseId]
        );
        if(updatedEnrollment.rowCount === 0) return {
            error: "El estudiante no está inscrito en este curso"
        };
        return {
            message: "Progreso del estudiante actualizado exitosamente"
        }
    });

    // Método para inscribir a un estudiante en un curso
    static enrollStudentInCourse = WithDBConnection(async(data) => {
        if(!data) return {error: "No se proporcionaron datos para la inscripción"};
        const {user_id, course_id} = data;
        // Se verifica que el usuario y el curso existan
        const existingUser = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
        const existingCourse = await db.query(`SELECT * FROM courses WHERE id = $1`, [course_id]);
        if(existingUser.rowCount === 0 || existingCourse.rowCount === 0){
            return {error: "No se encontró el usuario o el curso con los IDs proporcionados"};
        }
        // Si existen, se verifica si ya el estudiante ya estaba inscrito en el curso
        const existingenrollment = await db.query(
            `SELECT * FROM user_course_enrollment WHERE user_id = $1 AND course_id = $2`,
            [user_id, course_id]
        );
        if(existingenrollment.rowCount > 0) return {
            error: "El estudiante ya está inscrito en este curso"
        }
        // Si no estaba inscrito, se procede a inscribirlo
        const newEnrollment = await db.query(
            `INSERT INTO user_course_enrollment (user_id, course_id)
            VALUES ($1, $2)`, [user_id, course_id]
        );
        if(newEnrollment.rowCount === 0) return {error: "No se pudo inscribir al estudiante en el curso"};
        return {
            message: `Estudiante ${existingUser.rows[0].username} inscrito en el curso 
            ${existingCourse.rows[0].title_course} exitosamente`
        }
    });

    // Método para actualizar la inscripción de un estudiante en un curso
    static updateEnrollment = WithDBConnection(async(userId, courseId, dataUpdate) => {
        if(!dataUpdate) return {error: "No se proporcionaron datos para la actualización de la inscripción"};
        const allowedFields = ['progress_percentage', 'completed_at'];
        const fieldsToUpdate = {};
        for(const field of allowedFields){
            if(dataUpdate[field] !== undefined){
                fieldsToUpdate[field] = dataUpdate[field];
            }
        }
        // Se verifica que el usuario este inscrito en el curso
        const existingenrollment = await db.query(
            `SELECT * FROM user_course_enrollment WHERE user_id = $1 AND course_id = $2`,
            [dataUpdate.user_id, dataUpdate.course_id]
        );
        if(existingenrollment.rowCount === 0) return {
            error: "El estudiante no está inscrito en este curso"
        }
        // Si existe, se actualizan los campos proporcionados
        const fields = [];
        const values = [];

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        });
        values.push(dataUpdate.user_id);
        values.push(dataUpdate.course_id);
        const updatedEnrollment = await db.query(
            `UPDATE user_course_enrollment SET ${fields.join(', ')}
            WHERE user_id = $${values.length - 1} AND course_id = $${values.length}`,
            values
        );
        if(updatedEnrollment.rowCount === 0) return {
            error: "No se pudo actualizar la inscripción del estudiante en el curso"
        };
        return {
            message: "Inscripción del estudiante actualizada exitosamente"
        }
    });

    // Método para eliminar la inscripción de un estudiante en un curso
    static deleteEnrollment = WithDBConnection(async(userId, courseId) => {
        if(!userId || !courseId) return {error: "El ID del usuario o del curso no fue proporcionado"};
        // Se verifica si el estudiante y el curso existen
        const existingUser = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        const existingCourse = await db.query(`SELECT * FROM courses WHERE id = $1`, [courseId]);
        if(existingUser.rowCount === 0 || existingCourse.rowCount === 0){
            return {error: "No se encontró el usuario o el curso con los IDs proporcionados"};
        }
        // Si existen, se procede a eliminar la inscripción del estudiante en el curso
        const deletedEnrollment = await db.query(
            `DELETE FROM user_course_enrollment WHERE user_id = $1 AND course_id = $2`,
            [userId, courseId]
        );
        if(deletedEnrollment.rowCount === 0) return {
            error: "El estudiante no está inscrito en este curso"
        }
        return {
            message: `Inscripción del estudiante ${existingUser.rows[0].username} en el curso 
            ${existingCourse.rows[0].title_course} eliminada exitosamente`
        }
    })
}