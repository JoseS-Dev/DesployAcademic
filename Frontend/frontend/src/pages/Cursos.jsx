import { Link } from 'react-router-dom';

export default function Cursos() {
  // Datos de ejemplo - en una aplicación real, esto vendría de una API
  const cursos = [
    {
      id: 1,
      titulo: 'Desarrollo Web con React',
      descripcion: 'Aprende a crear aplicaciones web modernas con React y sus ecosistemas.',
      nivel: 'Principiante',
      duracion: '12 horas',
      progreso: 30,
      imagen: '/react-course.jpg'
    },
    {
      id: 2,
      titulo: 'Backend con Node.js',
      descripcion: 'Crea APIs robustas y escalables con Node.js, Express y MongoDB.',
      nivel: 'Intermedio',
      duracion: '15 horas',
      progreso: 0,
      imagen: '/nodejs-course.jpg'
    },
    {
      id: 3,
      titulo: 'Docker y Kubernetes',
      descripcion: 'Domina la contenerización y orquestación de aplicaciones modernas.',
      nivel: 'Avanzado',
      duracion: '10 horas',
      progreso: 0,
      imagen: '/docker-course.jpg'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nuestros Cursos
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Aprende las habilidades más demandadas en la industria tecnológica.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => (
            <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Imagen del curso</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {curso.nivel}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{curso.duracion}</span>
                  </div>
                  {curso.progreso > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      En progreso
                    </span>
                  )}
                </div>
                <Link 
                  to={`/curso/${curso.id}`}
                  className="mt-2 block"
                >
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                    {curso.titulo}
                  </h3>
                </Link>
                <p className="mt-3 text-base text-gray-500">
                  {curso.descripcion}
                </p>
                {curso.progreso > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{curso.progreso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${curso.progreso}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <Link
                    to={`/curso/${curso.id}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {curso.progreso > 0 ? 'Continuar' : 'Comenzar'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
