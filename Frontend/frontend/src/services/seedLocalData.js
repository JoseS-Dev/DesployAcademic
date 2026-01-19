// Seed inicial para poblar localStorage con datos de ejemplo
const seed = () => {
  if (localStorage.getItem('seeded')) return;

  const users = [
    { id: 'u1', nombre: 'José Santana', email: 'jose@desploy.com', password: '123456', rol: 'admin', plan: 'premium', createdAt: new Date().toISOString() },
    { id: 'u2', nombre: 'Alumno Demo', email: 'alumno@demo.com', password: 'password', rol: 'estudiante', plan: 'gratuito', createdAt: new Date().toISOString() }
  ];

  const categorias = [
    { id: 'c1', nombre: 'Despliegue' },
    { id: 'c2', nombre: 'Frontend' }
  ];

  const cursos = [
    { id: 'curso-1', titulo: 'Despliegue con Docker', descripcion: 'Aprende a desplegar apps con Docker y CI/CD', categoria: 'c1', instructorId: 'u1', precio: 0 },
    { id: 'curso-2', titulo: 'React desde cero', descripcion: 'Fundamentos de React y Vite', categoria: 'c2', instructorId: 'u1', precio: 0 }
  ];

  const instructores = [
    { id: 'u1', nombre: 'José Santana', bio: 'Instructor principal' }
  ];

  const inscripciones = [];

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('categorias', JSON.stringify(categorias));
  localStorage.setItem('cursos', JSON.stringify(cursos));
  localStorage.setItem('instructores', JSON.stringify(instructores));
  localStorage.setItem('inscripciones', JSON.stringify(inscripciones));

  localStorage.setItem('seeded', '1');
};

export default seed;
