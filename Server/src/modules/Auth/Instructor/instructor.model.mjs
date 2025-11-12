import { WithDBConnection } from "../../../core/utils/function.mjs";
import { db } from "../../../../database/db.mjs";
import pkg from 'lodash';

const { omit } = pkg;

// Modelo que interactúa con la tabla instructors_profiles de la base de datos
export class InstructorModel {
    
    // Método para obtener a todos los instructores del sistema 
    static getAllInstructors = WithDBConnection(async () => {
        const instructors = await db.query(
            `SELECT U.name_user, IP.* FROM instructors_profiles IP
            JOIN users U ON IP.user_id = U.id`
        );
        if(instructors.rowCount === 0) return {error: "No se encontraron instructores"};
        return {message: `Se encontraron ${instructors.rowCount} instructores`, 
        instructors: instructors.rows};
    });

    // Método para obtener el perfil de un instructor por su ID
    static getInstructorById = WithDBConnection(async (instructorId) => {
        if(!instructorId) return {error: "El ID del instructor no fue proporcionado"};
        // Se verifica si el instructor existe
        const instructor = await db.query(
            `SELECT U.*, IP.* FROM instructors_profiles IP
            JOIN users U ON IP.user_id = U.id WHERE IP.user_id = $1`,
            [instructorId]
        );
        if(instructor.rowCount === 0) return {error: "No se encontró un instructor con ese ID"};
        return {instructor: instructor.rows[0]};
    });

    // Método para obtener a los instructores según una categoria
    static getInstructorByCategory = WithDBConnection(async (categoryInstructor) => {
        if(!categoryInstructor) return {error: "La categoría del instructor no fue proporcionada"};
        // Se obtiene a los instructores que pertenecen a esa categoría
        const instructors = await db.query(
            `SELECT U.name_user, IP.* FROM instructors_profiles IP
            JOIN users U ON IP.user_id = U.id WHERE IP.category = $1`,
            [categoryInstructor]
        );
        if(instructors.rowCount === 0) return {error: "No se encontraron instructores en esa categoría"};
        return {message: `Se encontraron ${instructors.rowCount} instructores en la categoría 
        ${categoryInstructor}`, instructors: instructors.rows};
    });

    // Método para que un instructor cree su perfil
    static createInstructorProfile = WithDBConnection(async (instructorData) => {
        if(!instructorData) return {error: "Faltan datos para crear el perfil de instructor"};
        const {
            user_id, description_instructor, profile_picture,
            category_instructor, website, social_links
        } = instructorData;
        // Se verifica que el instructor no tenga ya un perfil
        const existingProfile = await db.query(
            `SELECT * FROM instructors_profiles WHERE user_id = $1`,
            [user_id]
        );
        if(existingProfile.rowCount > 0) return {error: "El instructor ya tiene un perfil creado"};
        // Si no tiene perfil, se procede a crearlo
        const newProfile = await db.query(
            `INSERT INTO instructors_Profiles(user_id, description_instructor, profile_picture,
            category_instructor, website, social_links) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                user_id, description_instructor, profile_picture,
                category_instructor, website, social_links
            ]
        )
        if(newProfile.rowCount === 0) return {error: "No se pudo crear el perfil de instructor"};
        return {message: "Perfil de instructor creado exitosamente",
        instructorProfile: newProfile.rows[0]};
    })

    // Método para que un usuario siga a un instructor
    static followInstructor = WithDBConnection(async (userId, instructorId) => {
        if(!userId || !instructorId) return {error: "Faltan datos para seguir al instructor"};
        // Se verifica si el usuario y el instructor existen
        const existingUser = await db.query(`SELECT id FROM users WHERE id = $1`, [userId]);
        const existingInstructor = await db.query(
            `SELECT id FROM instructors_profiles WHERE user_id = $1`,
            [instructorId]
        );
        if(existingUser.rowCount === 0 || existingInstructor.rowCount === 0){
            return {error: "El usuario o el instructor no existen"};
        }
        // Ahora, verificamos que el usuario no siga ya al instructor
        const existingFollow = await db.query(
            `SELECT * FROM instructors_followers WHERE user_id = $1 AND instructor_id = $2 
            AND is_follow = true`,
            [userId, instructorId]
        );
        if(existingFollow.rowCount > 0){
            // Si lo sigue, lo dejamos de seguir
            await db.query(
                `UPDATE instructors_followers SET is_follow = false , desfollowing_at = NOW()
                WHERE user_id = $1 AND instructor_id = $2`,
                [userId, instructorId]
            );
            // Además, reducimos el contador de seguidores del instructor
            await db.query(
                `UPDATE instructors_profiles SET total_students = total_students - 1
                WHERE user_id = $1`,
                [instructorId]
            );
            return {message: "Has dejado de seguir al instructor"};
        }
        // Si no lo sigue, procedemos a seguirlo
        await db.query(
            `INSERT INTO instructors_followers(user_id, instructor_id, is_follow)
            VALUES($1, $2, true)`,
            [userId, instructorId]
        );
        // Además, aumentamos el contador de seguidores del instructor
        await db.query(
            `UPDATE instructors_profiles SET total_students = total_students + 1
            WHERE user_id = $1`,
            [instructorId]
        );
        return {message: "Ahora sigues al instructor"};
    });

    // Método para actualizar los datos del perfil de un instructor
    static updateInstructorProfile = WithDBConnection(async (instructorId, dataUpdate) => {
        if(!instructorId || !dataUpdate){
            return {error: "Faltan datos para actualizar el perfil de instructor"};
        }
        // Definimos los campos que se va a tomar en cuenta para su actualización
        const allowedFields = [
            'description_instructor', 'profile_picture', 'category_instructor',
            'website', 'social_links'
        ]
        const fieldsToUpdate = {};
        for(const field of allowedFields){
            if(dataUpdate[field] !== undefined){
                fieldsToUpdate[field] = dataUpdate[field];
            }
        }

        // Se verifica que el instructor exista
        const existingInstructor = await db.query(
            `SELECT * FROM instructors_profiles WHERE user_id = $1`,
            [instructorId]
        );
        if(existingInstructor.rowCount === 0) return {error: "No se encontró un instructor con ese ID"};
        // Si existe, se procede a actualizar
        const fields = [];
        const values = [];

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        });
        values.push(instructorId); // Agrego el ID del instructor al final de los valores
        
        const updatedInstructor = await db.query(
            `UPDATE instructors_profiles SET ${fields.join(", ")} WHERE user_id = $${values.length}`,
            values
        );
        if(updatedInstructor.rowCount === 0) return {error: "No se pudo actualizar el perfil del instructor"};
        return {message: "Perfil de instructor actualizado exitosamente"};
    });

    // Método para eliminar el perfil de un instructor
    static deleteInstructorProfile = WithDBConnection(async (instructorId) => {
        if(!instructorId) return {error: "Falta el ID del instructor para eliminar su perfil"};
        // Se verifica que el instructor exista
        const existingInstructor = await db.query(
            `SELECT * FROM instructors_profiles WHERE user_id = $1`,
            [instructorId]
        );
        if(existingInstructor.rowCount === 0) return {error: "No se encontró un instructor con ese ID"};
        // Si existe, se procede a eliminar
        await db.query(
            `DELETE FROM instructors_profiles WHERE user_id = $1`,
            [instructorId]
        );
        // Además de cambiar su rol a estudiante
        await db.query(
            `UPDATE users SET role_user = 'student' WHERE user_id = $1`,
            [instructorId]
        );
        return {message: "Perfil de instructor eliminado exitosamente"};
    })
}