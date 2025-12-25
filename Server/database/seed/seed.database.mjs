import {db} from '../db.mjs';
import { getSeedFunctionByTable } from '../../src/core/utils/function.mjs';
import {
    mockCategories,
    mockCourseCategories,
    mockCourses,
    mockInstructorCourses,
    mockInstructorProfiles,
    mockLessons,
    mockResources,
    mockSections,
    mockUsers,
    mockLoginSessions,
    mockRoles,
    mockReviews
} from '../../src/mocks/index.mjs';

// Función para sembrar la base de datos con datos simulados
export async function seedDatabase(){
    try{
        // Inserto los datos simulados en las tablas correspondientes
        console.log("Sembrando la base de datos...");
        await db.query('BEGIN');
        // Auth
        await getSeedFunctionByTable('users', mockUsers);
        console.log("Usuarios sembrados");
        await db.query('COMMIT');
        await getSeedFunctionByTable('roles', mockRoles);
        console.log("Roles sembrados");
        await db.query('COMMIT');
        await getSeedFunctionByTable('login_sessions', mockLoginSessions);
        console.log("Sesiones de login sembradas");
        await db.query('COMMIT');
        // Categories
        await getSeedFunctionByTable('categories_course', mockCategories);
        console.log("Categorías sembradas");
        await db.query('COMMIT');
        // Courses
        await getSeedFunctionByTable('courses', mockCourses);
        console.log("Cursos sembrados");
        await db.query('COMMIT');
        await getSeedFunctionByTable('instructor_profiles', mockInstructorProfiles);
        console.log("Perfiles de instructores sembrados");
        await db.query('COMMIT');
        await getSeedFunctionByTable('instructor_courses', mockInstructorCourses);
        console.log("Cursos de instructores sembrados");
        await db.query('COMMIT');
        await getSeedFunctionByTable('reviews_course', mockReviews);
        console.log("Reseñas de cursos sembradas");
        await db.query('COMMIT');
         await getSeedFunctionByTable('course_categories', mockCourseCategories);
        console.log("Categorías de cursos sembradas");
        await db.query('COMMIT');
        // Sections
        await getSeedFunctionByTable('sections_course', mockSections);
        console.log("Secciones de cursos sembradas");
        await db.query('COMMIT');
        // Lessons
        await getSeedFunctionByTable('lessons_course', mockLessons);
        console.log("Lecciones de cursos sembradas");
        await db.query('COMMIT');
        await getSeedFunctionByTable('resources_lesson', mockResources);
        console.log("Recursos de lecciones sembrados");
        await db.query('COMMIT');
        console.log("Base de datos sembrada exitosamente");
    }
    catch(error){
        await db.query('ROLLBACK');
        console.error("Error al sembrar la base de datos:", error);
    }
}

seedDatabase();