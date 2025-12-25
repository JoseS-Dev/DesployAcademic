// Defino el servicio para el desarrollo de un usuario en un curso
import { LIST_CONSTANTS } from "../../../utils/constants/constant.utils";
import type { UpdateUserCourseProgress } from "../../../interfaces";

export class ServiceEnrollment {
    // Servicio para obtener todos los estudiantes inscritos en un curso
    getEnrollmentsByCourse = async(courseId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/enrollments/course/${courseId}/students`);
            if(!response.ok) return { success: false, data: null };
            const result = await response.json();
            if(result.error) return { success: false, error: result.error };
            return {
                success: true,
                message: result.message,
                data: result.enrollments
            }
        }
        catch(error){
            return { success: false, error: 'Error del Servidor' };
        }
    }

    // Servicio para obtener todos los cursos en los que un usuario está inscrito
    getEnrollmentsByUser = async(userId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/enrollments/user/${userId}/courses`);
            if(!response.ok) return { success: false, data: null };
            const result = await response.json();
            if(result.error) return { success: false, error: result.error };
            return {
                success: true,
                message: result.message,
                data: result.enrollments
            }
        }
        catch(error){
            return { success: false, error: 'Error del Servidor' };
        }
    }

    // Servicio para actualizar el progreso de un usuario en un curso
    updateUserCourseProgress = async(userData: UpdateUserCourseProgress) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/enrollments/user/${userData.user_id}/course/${userData.course_id}/progress`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if(!response.ok) return { success: false, data: null };
            const result = await response.json();
            if(result.error) return { success: false, error: result.error };
            return {
                success: true,
                message: result.message
            }
        }
        catch(error){
            return { success: false, error: 'Error del Servidor' };
        }
    }

    // Servicio para inscribir a un usuario en un curso
    enrollUserInCourse = async(userId: number, courseId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/enrollments/enroll/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, course_id: courseId })
            });
            if(!response.ok) return { success: false, data: null };
            const result = await response.json();
            if(result.error) return { success: false, error: result.error };
            return {
                success: true,
                message: result.message
            }
        }
        catch(error){
            return { success: false, error: 'Error del Servidor' };
        }
    }

    // Servicio para desinscribir a un usuario de un curso
    unenrollUserFromCourse = async(userId: number, courseId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/enrollments/user/${userId}/course/${courseId}/delete`, {
                method: 'DELETE'
            });
            if(!response.ok) return { success: false, data: null };
            const result = await response.json();
            if(result.error) return { success: false, error: result.error };
            return {
                success: true,
                message: result.message
            }
        }
        catch(error){
            return { success: false, error: 'Error del Servidor' };
        }
    }
}