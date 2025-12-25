// Defino el servicio para los cursos
import { LIST_CONSTANTS } from "../../../utils/constants/constant.utils";

export class ServiceCourses{
    // Servicio para obtener todos los cursos de un instructor
    getCoursesByInstructor = async (instructorId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/instructor/${instructorId}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.courses
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para todos los cursos registrados en el sistema
    getAllCourses = async () => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/all`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.courses
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para buscar un curso por su slug
    getCourseBySlug = async (courseSlug: string) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/slug/${courseSlug}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.course
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para buscar cursos por su nivel de dificultad
    getCoursesByLevel = async (levelCourse: string) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/level/${levelCourse}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.courses
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para buscar cursos según su tipo
    getCoursesByType = async (typeCourse: string) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/type/${typeCourse}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.courses
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para crear un curso
    createCourse = async (courseData: FormData) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/create`, {
                method: 'POST',
                body: courseData
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.course
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para actualizar un curso
    updateCourse = async (courseId: number, courseData: FormData) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/course/${courseId}/update`, {
                method: 'PATCH',
                body: courseData
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.course
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para cambiar el estado de un curso
    changeCourseStatus = async (courseId: number, newStatus: boolean) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/course/${courseId}/change-status`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({is_published: newStatus})
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para eliminar un curso
    deleteCourse = async (courseId: number) => {
        try{
           const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/course/${courseId}/delete`, {
                method: 'DELETE'
           });
           if(!response.ok) return {success: false, data: null};
           const result = await response.json();
           if(result.error) return {success: false, error: result.error};
           return {
                success: true,
                message: result.message
           } 
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }
}