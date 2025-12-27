

// Servicio para obtener todas las lecciones de una sección
export const getLessonsBySectionId = async(sectionId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/section/${sectionId}/all`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para obtener una lección por su ID
export const getLessonById = async(lessonId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/lesson/${lessonId}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para obtener las lecciones gratuitas de una sección
export const getFreeLessonsBySectionId = async(sectionId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/section/${sectionId}/free-lessons`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para cambiar el estado de acceso gratuito de una lección
export const changeLessonFreeAccessStatus = async(lessonId: number, freeAccess: boolean) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/lesson/${lessonId}/change-free-access`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_preview: freeAccess })
        })
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para cambiar el estado de publicación de una lección
export const changeLessonPublishStatus = async(lessonId: number, publishStatus: boolean) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/lesson/${lessonId}/change-status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_published: publishStatus })
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para crear una nueva lección en una sección
export const createLesson = async(lessonData: FormData) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/create`, {
            method: 'POST',
            body: lessonData
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para actualizar una lección de una sección
export const updateLesson = async(lessonId: number, lessonData: FormData) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/lesson/${lessonId}/update`, {
            method: 'PATCH',
            body: lessonData
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para eliminar una lección de una sección
export const deleteLesson = async(lessonId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/lessons/lesson/${lessonId}/delete`, {
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

