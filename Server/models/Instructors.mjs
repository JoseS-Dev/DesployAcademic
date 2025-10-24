import { db } from '../config/db.mjs';
import { WithDBConnection } from '../utils.mjs';

export class ModelInstructors {
    // método que obtiene todos los instructores disponibles
    static getAllInstructors = WithDBConnection(async () => {
        const instructors = await db.query(`
            SELECT u.*, I.*, R.role FROM users u LEFT JOIN instructor_profiles I ON u.id = I.user_id
            LEFT JOIN roles R ON u.role_id = R.id WHERE R.role = 'instructor'
        `);
        return { instructors: instructors.rows };
    });
    
    // método que obtiene un instructor por su ID
    static getInstructorById = WithDBConnection(async ({ instructorId }) => {
        if (!instructorId) return { error: 'No se proporcionó un ID de instructor' };
        const instructor = await db.query(`
            SELECT u.*, i.*, R.role FROM users u LEFT JOIN instructor_profiles i ON u.id = i.user_id
            LEFT JOIN roles R ON u.role_id = R.id WHERE u.id = $1 AND R.role = 'instructor'
            `, [instructorId]);
        if (instructor.rowCount === 0) return { error: 'No se encontró el instructor' };
        return { instructor: instructor.rows[0] };
    });

    // método para crear un registrar al nuevo instructor
    static registerInstructor = WithDBConnection(async ({ userId, InstructorData}) => {
        if(!userId || !InstructorData) return { error: 'Faltan datos para registrar el instructor' };
        // Se verifica que el usuario exista y que tenga el rol de instructor
        const userCheck = await db.query(
            `SELECT u.id, R.role FROM users u
            JOIN roles R ON u.role_id = R.id WHERE u.id = $1 AND R.role = 'instructor'`,
            [userId]
        );
        if(userCheck.rowCount === 0){
            return { error: 'El usuario no existe o no tiene el rol de instructor' };
        }
        // Si existe el usuario, se procede a registrar el perfil del instructor
        const {description, profile_picture, website, social_links, 
        rating, total_students} = InstructorData;
        const newInstructor = await db.query(
            `INSERT INTO instructor_profiles(user_id, description, profile_picture, website, social_links,
            rating, total_students) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [userId, description, profile_picture, website, social_links, rating, total_students]
        );
        if(newInstructor.rowCount === 0) return { error: 'No se pudo registrar el instructor' };
        return { instructor: newInstructor.rows[0], message: 'Instructor registrado exitosamente' };
    })

    // método para actualizar el perfil de un instructor
    static updateInstructorProfile = WithDBConnection(async ({ instructorId, updateData}) => {
        if(!instructorId || !updateData) {
            return { error: 'Faltan datos para actualizar el perfil del instructor' };
        }
        const allowedFields = [
            'description', 'profile_picture', 'website', 'social_links'
        ]
        const fieldsToUpdate = {};
        for(const field of allowedFields){
            if(updateData[field] !== undefined){
                fieldsToUpdate[field] = updateData[field];
            }
        }
        // Se verifica si existe el instructor
        const instructorCheck = await db.query(
            'SELECT id FROM instructor_profiles WHERE user_id = $1',
            [instructorId]
        );
        if(instructorCheck.rowCount === 0) return { error: 'No se encontró el instructor' };
        // Si existe, se procede a actualizar su perfil
        const fields = [];
        const values = [];

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        });
        values.push(instructorId); 
        // Creamos la consulta dinámica
        const updatedInstructor = await db.query(
            `UPDATE instructor_profiles SET ${fields.join(', ')}
            WHERE user_id = $${values.length} RETURNING *`,
            values
        );
        if(updatedInstructor.rowCount === 0) return { 
        error: 'No se pudo actualizar el perfil del instructor' };
        return { instructor: updatedInstructor.rows[0], 
        message: 'Perfil del instructor actualizado exitosamente' };
    })

}