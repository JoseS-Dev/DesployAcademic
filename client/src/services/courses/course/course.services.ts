
// Servicio para obtener todos los cursos de un instructor
export const getCoursesByInstructor = async (instructorId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/instructor/${instructorId}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
 // Servicio para todos los cursos registrados en el sistema
export const getAllCourses = async () => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/all`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
 // Servicio para buscar un curso por su slug
export const getCourseBySlug = async (courseSlug: string) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/slug/${courseSlug}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
 // Servicio para buscar cursos por su nivel de dificultad
export const getCoursesByLevel = async (levelCourse: string) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/level/${levelCourse}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
 // Servicio para buscar cursos según su tipo
export const getCoursesByType = async (typeCourse: string) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/type/${typeCourse}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
 // Servicio para crear un curso
export const createCourse = async (courseData: FormData) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/create`, {
            method: 'POST',
            body: courseData
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
 // Servicio para actualizar un curso
export const updateCourse = async (courseId: number, courseData: FormData) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/course/${courseId}/update`, {
            method: 'PATCH',
            body: courseData
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
 // Servicio para cambiar el estado de un curso
export const changeCourseStatus = async (courseId: number, newStatus: boolean) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/course/${courseId}/change-status`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({is_published: newStatus})
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
 // Servicio para eliminar un curso
export const deleteCourse = async (courseId: number) => {
    try{
       const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/course/${courseId}/delete`, {
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
