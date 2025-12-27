// Defino el servicio para el desarrollo de un usuario en un curso
import type { UpdateUserCourseProgress } from "../../../interfaces";


// Servicio para obtener todos los estudiantes inscritos en un curso
export const getEnrollmentsByCourse = async(courseId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/enrollments/course/${courseId}/students`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}

// Servicio para obtener todos los cursos en los que un usuario está inscrito
export const getEnrollmentsByUser = async(userId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/enrollments/user/${userId}/courses`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}

// Servicio para actualizar el progreso de un usuario en un curso
export const updateUserCourseProgress = async(userData: UpdateUserCourseProgress) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/enrollments/user/${userData.user_id}/course/${userData.course_id}/progress`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}

// Servicio para inscribir a un usuario en un curso
export const enrollUserInCourse = async(userId: number, courseId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/enrollments/enroll/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId, course_id: courseId })
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}

// Servicio para desinscribir a un usuario de un curso
export const unenrollUserFromCourse = async(userId: number, courseId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/enrollments/user/${userId}/course/${courseId}/delete`, {
            method: 'DELETE'
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
