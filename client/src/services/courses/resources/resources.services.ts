

// Servicio para obtener todos los recursos de una lección
export const getAllResourcesByLessonId = async(lessonId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/resources/lesson/${lessonId}/all`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para obtener un recurso por su ID
export const getResourceById = async(resourceId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/resources/resource/${resourceId}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para crear un recurso para una lección
export const createResource = async(resourceData: FormData) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/resources/create`, {
            method: 'POST',
            body: resourceData
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para actualizar un recurso por su ID
export const updateResource = async(resourceId: number, resourceData: FormData) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/resources/resource/${resourceId}/update`, {
            method: 'PATCH',
            body: resourceData
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para eliminar un recurso por su ID
export const deleteResource = async(resourceId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/resources/resource/${resourceId}/delete`, {
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
