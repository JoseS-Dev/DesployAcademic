import { db } from '../database/db.mjs';
import { WithDBConnection } from '../utils.mjs';
import pkg from 'lodash';

const { omit } = pkg;

export class ModelInstructors {
    // método para obtener a todos los instructores
    static getAllInstructors = WithDBConnection(async () => {
        const instructors = await db.query(
            `SELECT u.*, R.role FROM users u JOIN user_roles R ON u.id = R.user_id 
            WHERE R.role = 'instructor'`,
        )
        if(instructors.rowCount === 0) return { error: 'No se encontraron instructores' };
        const sanitizedInstructors = instructors.rows.map(inst => {
            return omit(inst, ['password_hash']);
        });
        return { instructors: sanitizedInstructors, message: 'Instructores obtenidos correctamente' };
    });

    // método para obtener a un instructor por su ID
    static getInstructorById = WithDBConnection(async ({ instructorId }) => {
        if(!instructorId) return { error: 'ID de instructor no proporcionado' };
        const instructor = await db.query(
            `SELECT u.*, I.* FROM users u JOIN instructor_profiles I ON u.id = I.user_id
            WHERE u.id = $1`, [instructorId]
        );
        if(instructor.rowCount === 0) return { error: 'Instructor no encontrado' };
        const sanitizedInstructor = omit(instructor.rows[0], ['password_hash', 'id', 'user_id']);
        return { instructor: sanitizedInstructor, message: 'Instructor obtenido correctamente' };
    })

    // método para registrar un nuevo instructor
    static registerInstructor = WithDBConnection(async ({ userId, instructorData }) => {
        if(!userId || !instructorData){
            return { error: 'Datos incompletos para registrar instructor' };
        }
        // Se verifica si el usuario ya es un instructor
        const existingInstructor = await db.query(
            `SELECT u.id FROM users u JOIN user_roles R ON u.id = R.user_id
            WHERE u.id = $1 AND R.role = 'instructor'`, [userId]
        )
        if(existingInstructor.rowCount == 0) return { error: 'El usuario no tiene rol de instructor' };
        // Si existe, se inserta el perfil del instructor
        const { profile_picture, description, social_links, website } = instructorData;
        const newInstructor = await db.query(
            `INSERT INTO instructor_profiles (user_id, profile_picture, description, social_links, 
            website) VALUES ($1, $2, $3, $4, $5)`,[
                userId, profile_picture, description, social_links, website
            ]
        );
        if(newInstructor.rowCount === 0) return { error: 'Error al registrar el perfil de instructor' };
        return { instructor: newInstructor.rows[0], message: 'Perfil de instructor registrado correctamente' };
    });

    // método para actualizar el perfil de un instructor
    static updateInstructorProfile = WithDBConnection(async ({ instructorId, profileData }) => {
        if(!instructorId || !profileData){
            return { error: 'Datos incompletos para actualizar instructor' };
        }
        const allowedFields = [
            'profile_picture', 'description', 'social_links', 'website'
        ];
        const fieldsToUpdate = {};
        for(const field of allowedFields){
            if(profileData[field] !== undefined){
                fieldsToUpdate[field] = profileData[field];
            }
        }
        // Se verifica si existe el instructor
        const existingInstructor = await db.query(
            `SELECT id FROM instructor_profiles WHERE user_id = $1`, [instructorId]
        );
        if(existingInstructor.rowCount === 0) return { error: 'Instructor no encontrado' };
        // si existe, se procede a actualizar
        const fields = [];
        const values = [];

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        })
        values.push(instructorId);
        // Actualizamos el instructor
        const updateInstructor = await db.query(
            `UPDATE instructor_profiles SET ${fields.join(', ')} WHERE user_id = $${values.length}`,
            values
        );
        if(updateInstructor.rowCount === 0) return { error: 'Error al actualizar el perfil de instructor' };
        return { message: 'Perfil de instructor actualizado correctamente' };
    });

    // método para que un usuario siga a un instructor
    static followInstructor = WithDBConnection(async ({ userId, instructorId }) => {
        if(!userId || !instructorId){
            return { error: 'Datos incompletos para seguir instructor' };
        }
        // Se verifica si ya lo sigue
        const existingFollow = await db.query(
            `SELECT * FROM instructor_followers WHERE user_id = $1 AND instructor_id = $2`,
            [userId, instructorId]
        );
        if(existingFollow.rowCount > 0) return { error: 'Ya sigues a este instructor' };
        // Si no lo sigue, se inserta el registo y se aumenta el numero de estudiantes
        await db.query(
            `INSERT INTO instructor_followers (user_id, instructor_id) VALUES ($1, $2)`,
            [userId, instructorId]
        );
        await db.query(
            `UPDATE instructor_profiles SET total_students = total_students + 1 WHERE id = $1`,
            [instructorId]
        );
        return { message: 'Ahora sigues a este instructor' };
    })
}