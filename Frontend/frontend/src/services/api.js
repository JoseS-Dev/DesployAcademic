// Servicio API para conectar con el backend o usar adapter local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const LOCAL_MODE = (import.meta.env.VITE_LOCAL_MODE ?? 'true') === 'true';

let localAdapter = null;
if (LOCAL_MODE) {
  // lazy import local adapter
  // eslint-disable-next-line no-undef
  localAdapter = await import('./localAdapter.js');
}

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
export const authAPI = LOCAL_MODE ? {
  register: (data) => localAdapter.default.auth.register(data),
  login: (email, password) => localAdapter.default.auth.login(email, password),
  logout: () => localAdapter.default.auth.logout(),
  getCurrentUser: () => localAdapter.default.auth.getCurrentUser(),
  updateProfile: (data) => localAdapter.default.auth.updateProfile(data),
} : {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request('/auth/me'),
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// ==================== CURSOS ====================
export const cursosAPI = LOCAL_MODE ? {
  getAll: (params = {}) => localAdapter.default.cursos.getAll(params),
  getById: (id) => localAdapter.default.cursos.getById(id),
  getByCategory: (categoryId) => localAdapter.default.cursos.getAll({ categoria: categoryId }),
  create: (data) => localAdapter.default.cursos.create(data),
  update: (id, data) => localAdapter.default.cursos.update(id, data),
  delete: (id) => localAdapter.default.cursos.delete(id),
} : {
  getAll: (params = {}) => { const query = new URLSearchParams(params).toString(); return request(`/cursos${query ? `?${query}` : ''}`); },
  getById: (id) => request(`/cursos/${id}`),
  getByCategory: (categoryId) => request(`/cursos?categoria=${categoryId}`),
  create: (data) => request('/cursos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/cursos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/cursos/${id}`, { method: 'DELETE' }),
};

// ==================== CATEGORÍAS ====================
export const categoriasAPI = LOCAL_MODE ? {
  getAll: () => localAdapter.default.categorias.getAll(),
  getById: (id) => localAdapter.default.categorias.getById(id),
  create: (data) => { throw new Error('Create not implemented in local mode'); }
} : {
  getAll: () => request('/categorias'),
  getById: (id) => request(`/categorias/${id}`),
  create: (data) => request('/categorias', { method: 'POST', body: JSON.stringify(data) }),
};

// ==================== INSCRIPCIONES ====================
export const inscripcionesAPI = LOCAL_MODE ? {
  inscribirse: (cursoId) => localAdapter.default.inscripciones.inscribirse(cursoId),
  getMisInscripciones: () => localAdapter.default.inscripciones.getMisInscripciones(),
  getInscripcion: (cursoId) => null,
  cancelar: (inscripcionId) => localAdapter.default.inscripciones.cancelar(inscripcionId),
} : {
  inscribirse: (cursoId) => request('/inscripciones', { method: 'POST', body: JSON.stringify({ cursoId }) }),
  getMisInscripciones: () => request('/inscripciones/mis-cursos'),
  getInscripcion: (cursoId) => request(`/inscripciones/curso/${cursoId}`),
  cancelar: (inscripcionId) => request(`/inscripciones/${inscripcionId}`, { method: 'DELETE' }),
};

// ==================== SECCIONES ====================
export const seccionesAPI = LOCAL_MODE ? {
  getByCurso: (cursoId) => localAdapter.default.secciones.getByCurso(cursoId),
  create: () => { throw new Error('not implemented'); },
  update: () => { throw new Error('not implemented'); },
  delete: () => { throw new Error('not implemented'); },
} : {
  getByCurso: (cursoId) => request(`/cursos/${cursoId}/secciones`),
  create: (cursoId, data) => request(`/cursos/${cursoId}/secciones`, { method: 'POST', body: JSON.stringify(data) }),
  update: (cursoId, seccionId, data) => request(`/cursos/${cursoId}/secciones/${seccionId}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (cursoId, seccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}`, { method: 'DELETE' }),
};

// ==================== LECCIONES ====================
export const leccionesAPI = LOCAL_MODE ? {
  getBySeccion: (cursoId, seccionId) => localAdapter.default.lecciones.getBySeccion(cursoId, seccionId),
  getById: (cursoId, seccionId, leccionId) => null,
  create: () => { throw new Error('not implemented'); },
  update: () => { throw new Error('not implemented'); },
  delete: () => { throw new Error('not implemented'); },
} : {
  getBySeccion: (cursoId, seccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones`),
  getById: (cursoId, seccionId, leccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}`),
  create: (cursoId, seccionId, data) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones`, { method: 'POST', body: JSON.stringify(data) }),
  update: (cursoId, seccionId, leccionId, data) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (cursoId, seccionId, leccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}`, { method: 'DELETE' }),
};

// ==================== RECURSOS ====================
export const recursosAPI = LOCAL_MODE ? {
  getByLeccion: (cursoId, seccionId, leccionId) => localAdapter.default.recursos.getByLeccion(cursoId, seccionId, leccionId),
  create: () => { throw new Error('not implemented'); },
  delete: () => { throw new Error('not implemented'); },
} : {
  getByLeccion: (cursoId, seccionId, leccionId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}/recursos`),
  create: (cursoId, seccionId, leccionId, data) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}/recursos`, { method: 'POST', body: JSON.stringify(data) }),
  delete: (cursoId, seccionId, leccionId, recursoId) => request(`/cursos/${cursoId}/secciones/${seccionId}/lecciones/${leccionId}/recursos/${recursoId}`, { method: 'DELETE' }),
};

// ==================== RESEÑAS ====================
export const reseñasAPI = LOCAL_MODE ? {
  getByCurso: (cursoId) => localAdapter.default.reseñas.getByCurso(cursoId),
  create: () => { throw new Error('not implemented'); },
  update: () => { throw new Error('not implemented'); },
  delete: () => { throw new Error('not implemented'); },
} : {
  getByCurso: (cursoId) => request(`/cursos/${cursoId}/reseñas`),
  create: (cursoId, data) => request(`/cursos/${cursoId}/reseñas`, { method: 'POST', body: JSON.stringify(data) }),
  update: (cursoId, reseñaId, data) => request(`/cursos/${cursoId}/reseñas/${reseñaId}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (cursoId, reseñaId) => request(`/cursos/${cursoId}/reseñas/${reseñaId}`, { method: 'DELETE' }),
};

// ==================== INSTRUCTORES ====================
export const instructoresAPI = LOCAL_MODE ? {
  getAll: () => localAdapter.default.instructores.getAll(),
  getById: (id) => localAdapter.default.instructores.getById(id),
  getCursos: () => [],
  create: () => { throw new Error('not implemented'); },
  update: () => { throw new Error('not implemented'); },
} : {
  getAll: () => request('/instructores'),
  getById: (id) => request(`/instructores/${id}`),
  getCursos: (instructorId) => request(`/instructores/${instructorId}/cursos`),
  create: (data) => request('/instructores', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/instructores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
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

