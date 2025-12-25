// Functión para obtener el token del usuario
export function getToken(){
    return localStorage.getItem('token') || null;
}

// Función para realizar un fecth con autenticación
export function authFetch(url: string, options: RequestInit = {}){
    const token = getToken();
    if(token){
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url, options);
}