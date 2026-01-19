import seed from './seedLocalData';
import { v4 as uuidv4 } from 'uuid';

// Inicializar seed la primera vez
seed();

const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// AUTH
export const auth = {
  register: async (data) => {
    const users = read('users');
    if (users.some(u => u.email === data.email)) throw new Error('Usuario ya existe');
    const newUser = { id: uuidv4(), ...data, createdAt: new Date().toISOString() };
    users.push(newUser);
    write('users', users);
    return newUser;
  },
  login: async (email, password) => {
    const users = read('users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Credenciales inválidas');
    return user;
  },
  logout: async () => true,
  getCurrentUser: async () => JSON.parse(localStorage.getItem('user') || 'null'),
  updateProfile: async (data) => {
    const users = read('users');
    const idx = users.findIndex(u => u.id === data.id);
    if (idx === -1) throw new Error('Usuario no encontrado');
    users[idx] = { ...users[idx], ...data };
    write('users', users);
    return users[idx];
  }
};

// CURSOS
export const cursos = {
  getAll: async (params = {}) => {
    let list = read('cursos');
    if (params.categoria) list = list.filter(c => c.categoria === params.categoria);
    return list;
  },
  getById: async (id) => read('cursos').find(c => c.id === id),
  create: async (data) => { const list = read('cursos'); const item = { id: uuidv4(), ...data }; list.push(item); write('cursos', list); return item; },
  update: async (id, data) => { const list = read('cursos'); const idx = list.findIndex(c => c.id === id); if (idx===-1) throw new Error('Not found'); list[idx] = { ...list[idx], ...data }; write('cursos', list); return list[idx]; },
  delete: async (id) => { let list = read('cursos'); list = list.filter(c => c.id !== id); write('cursos', list); return true; }
};

export const categorias = {
  getAll: async () => read('categorias'),
  getById: async (id) => read('categorias').find(c => c.id === id),
};

export const inscripciones = {
  inscribirse: async (cursoId) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) throw new Error('No autenticado');
    const list = read('inscripciones');
    const exists = list.some(i => i.userId === user.id && i.cursoId === cursoId);
    if (exists) throw new Error('Ya inscrito');
    const item = { id: uuidv4(), userId: user.id, cursoId, createdAt: new Date().toISOString() };
    list.push(item);
    write('inscripciones', list);
    return item;
  },
  getMisInscripciones: async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return [];
    return read('inscripciones').filter(i => i.userId === user.id);
  },
  cancelar: async (inscripcionId) => {
    let list = read('inscripciones');
    list = list.filter(i => i.id !== inscripcionId);
    write('inscripciones', list);
    return true;
  }
};

export const instructores = {
  getAll: async () => read('instructores'),
  getById: async (id) => read('instructores').find(i => i.id === id),
};

// Stubs for other resources to avoid runtime errors
export const secciones = { getByCurso: async () => [] };
export const lecciones = { getBySeccion: async () => [] };
export const recursos = { getByLeccion: async () => [] };
export const reseñas = { getByCurso: async () => [] };

export default {
  auth,
  cursos,
  categorias,
  inscripciones,
  instructores,
  secciones,
  lecciones,
  recursos,
  reseñas
};
