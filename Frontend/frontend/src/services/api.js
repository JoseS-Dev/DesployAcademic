// Servicio API para conectar con el backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Función helper para hacer peticiones
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
  
  // Si el body es FormData, no establecer Content-Type (el navegador lo hace automáticamente)
  const isFormData = options.body instanceof FormData;
  
  const config = {
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
      throw new Error(error.message || `Error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== AUTH ====================
export const authAPI = {
  register: (data) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  logout: () => request('/auth/logout', { method: 'POST' }),
  
  getCurrentUser: () => request('/auth/me'),
  
  updateProfile: (data) => request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// ==================== CURSOS ====================
export const cursosAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/cursos${query ? `?${query}` : ''}`);
  },
  
  getById: (id) => request(`/cursos/${id}`),
  
  getByCategory: (categoryId) => request(`/cursos?categoria=${categoryId}`),
  
  create: (data) => request('/cursos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => request(`/cursos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => request(`/cursos/${id}`, { method: 'DELETE' }),
};

// ==================== CATEGORÍAS ====================
export const categoriasAPI = {
  getAll: () => request('/categorias'),
  
  getById: (id) => request(`/categorias/${id}`),
  
  create: (data) => request('/categorias', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// ==================== INSCRIPCIONES ====================
export const inscripcionesAPI = {
  inscribirse: (cursoId) => request('/inscripciones', {
    method: 'POST',
    body: JSON.stringify({ cursoId }),
  }),
  
  getMisInscripciones: () => request('/inscripciones/mis-cursos'),
  
  getInscripcion: (cursoId) => request(`/inscripciones/curso/${cursoId}`),
  
  cancelar: (inscripcionId) => request(`/inscripciones/${inscripcionId}`, {
    method: 'DELETE',
  }),
};

// ==================== SECCIONES ====================
export const seccionesAPI = {
  getByCurso: (cursoId) => request(`/cursos/${cursoId}/secciones`),
  
  create: (cursoId, data) => request(`/cursos/${cursoId}/secciones`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (cursoId, seccionId, data) => request(`/cursos/${cursoId}/secciones/${seccionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (cursoId, seccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}`, {
    method: 'DELETE',
  }),
};

// ==================== LECCIONES ====================
export const leccionesAPI = {
  getBySeccion: (cursoId, seccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones`),
  
  getById: (cursoId, seccionId, leccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}`),
  
  create: (cursoId, seccionId, data) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (cursoId, seccionId, leccionId, data) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (cursoId, seccionId, leccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}`, {
    method: 'DELETE',
  }),
};

// ==================== RECURSOS ====================
export const recursosAPI = {
  getByLeccion: (cursoId, seccionId, leccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}/recursos`),
  
  create: (cursoId, seccionId, leccionId, data) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}/recursos`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  delete: (cursoId, seccionId, leccionId, recursoId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}/recursos/${recursoId}`, {
    method: 'DELETE',
  }),
};

// ==================== RESEÑAS ====================
export const reseñasAPI = {
  getByCurso: (cursoId) => request(`/cursos/${cursoId}/reseñas`),
  
  create: (cursoId, data) => request(`/cursos/${cursoId}/reseñas`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (cursoId, reseñaId, data) => request(`/cursos/${cursoId}/reseñas/${reseñaId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (cursoId, reseñaId) => request(`/cursos/${cursoId}/reseñas/${reseñaId}`, {
    method: 'DELETE',
  }),
};

// ==================== INSTRUCTORES ====================
export const instructoresAPI = {
  getAll: () => request('/instructores'),
  
  getById: (id) => request(`/instructores/${id}`),
  
  getCursos: (instructorId) => request(`/instructores/${instructorId}/cursos`),
  
  create: (data) => request('/instructores', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => request(`/instructores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// ==================== PAGOS ====================
export const pagosAPI = {
  procesarPago: (formData) => request('/pagos', {
    method: 'POST',
    body: formData,
    headers: {
      // No incluir Content-Type, el navegador lo establecerá automáticamente para FormData
    },
  }),
  
  obtenerTasaBCV: () => request('/pagos/tasa-bcv'),
  
  verificarPago: (pagoId) => request(`/pagos/${pagoId}/verificar`),
};

export default {
  auth: authAPI,
  cursos: cursosAPI,
  categorias: categoriasAPI,
  inscripciones: inscripcionesAPI,
  secciones: seccionesAPI,
  lecciones: leccionesAPI,
  recursos: recursosAPI,
  reseñas: reseñasAPI,
  instructores: instructoresAPI,
  pagos: pagosAPI,
};

