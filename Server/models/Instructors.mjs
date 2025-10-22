import { db, verifyDBConnection } from '../config/db.mjs';

// Un Wrapper para los modelos de instructores
const WithDBConnection = (fn) => {
    return async (...args) => {
        const isConnected = await verifyDBConnection();
        if (!isConnected) return { error: 'No se pudo conectar a la base de datos' };
        return fn(...args);
    }
}

export class ModelInstructors {
    // método que obtiene todos los instructores disponibles
    static getAllInstructors = WithDBConnection(async () => {
        const instructors = await db.query(`
            SELECT u.id, u.name_user, u.username, ip.description, ip.rating, ip.total_students
            FROM users u
            INNER JOIN instructor_profiles ip ON u.id = ip.user_id
            `);
        return { instructors: instructors.rows };
    });
    // método que obtiene un instructor por su ID

    static getInstructorById = WithDBConnection(async ({ instructorId }) => {
        if (!instructorId) return { error: 'No se proporcionó un ID de instructor' };
        const instructor = await db.query(`
            SELECT u.id, u.name_user, u.username, ip.description, ip.rating, ip.total_students
            FROM users u
            INNER JOIN instructor_profiles ip ON u.id = ip.user_id
            WHERE u.id = $1
            `, [instructorId]);
        if (instructor.rowCount === 0) return { error: 'No se encontró el instructor' };
        return { instructor: instructor.rows[0] };
    });

    // registrar un nuevo instructor a partir de un usuario existente

    static registerInstructor = WithDBConnection(async ({ userId, description }) => {
        if (!userId) return { error: 'No se proporcionó un ID de usuario' };

        // Verifico si el usuario ya es un instructor
        const existingInstructor = await db.query(
            'SELECT * FROM instructor_profiles WHERE user_id = $1',
            [userId]
        );
        if (existingInstructor.rowCount > 0) return { error: 'El usuario ya es un instructor' };

        // Obtener datos del usuario
        const { description, profile_picture, website, social_links } = description;

        // Si no es un instructor, procedo a registrarlo
        const newInstructor = await db.query(`
            INSERT INTO instructor_profiles (user_id, description, profile_picture, website, social_links)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, description, profile_picture, website, social_links]
        );
        if (newInstructor.rowCount === 0) return { error: 'No se pudo registrar el instructor' };
        return { instructor: newInstructor.rows[0], message: 'Instructor registrado exitosamente' };
    });

    // método que actualiza el perfil de un instructor
    static updateInstructorProfile = WithDBConnection(async ({ instructorId, profileData }) => {
        if (!instructorId) return { error: 'No se proporcionó un ID de instructor' };
        if (!profileData) return { error: 'No se proporcionaron datos para actualizar el perfil' };
        const { description, profile_picture, website, social_links } = profileData;

        const updatedInstructor = await db.query(`
            UPDATE instructor_profiles
            SET description = $1,
            profile_picture = $2,
            website = $3,
            social_links = $4
            WHERE user_id = $5
            RETURNING *`,
            [description, profile_picture, website, social_links, instructorId]
        );
        if (updatedInstructor.rowCount === 0) return { error: 'No se pudo actualizar el perfil del instructor' };
        return { instructor: updatedInstructor.rows[0], message: 'Perfil del instructor actualizado exitosamente' };
    });
}