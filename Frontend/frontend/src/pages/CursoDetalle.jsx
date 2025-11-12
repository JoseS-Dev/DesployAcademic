import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CursoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSubscribed } = useAuth();

  // Datos de ejemplo - en una aplicación real, esto vendría de una API
  const curso = {
    id: id,
    titulo: 'Curso de ' + (id === '1' ? 'React Avanzado' : id === '2' ? 'Node.js' : 'Desarrollo Web'),
    instructor: 'Instructor Ejemplo',
    descripcion: 'Este es un curso detallado sobre el tema seleccionado con lecciones prácticas y ejemplos del mundo real.',
    duracion: '10 horas',
    nivel: 'Intermedio',
    lecciones: [
      { id: 1, titulo: 'Introducción', duracion: '15 min', completada: true },
      { id: 2, titulo: 'Configuración del entorno', duracion: '20 min', completada: true },
      { id: 3, titulo: 'Conceptos básicos', duracion: '30 min', completada: false },
      { id: 4, titulo: 'Ejercicios prácticos', duracion: '45 min', completada: false },
    ],
    requiereSuscripcion: true
  };

  if (curso.requiereSuscripcion && !isSubscribed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-yellow-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Contenido Premium</h2>
          <p className="text-gray-600 mb-6">Este curso requiere una suscripción activa para acceder al contenido.</p>
          <button
            onClick={() => navigate('/suscripcion')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Ver planes de suscripción
          </button>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 w-full text-blue-600 hover:text-blue-800"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">{curso.titulo}</h1>
                <p className="mt-1 text-blue-100">{curso.instructor}</p>
              </div>
              <span className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                {curso.nivel}
              </span>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Descripción del curso</h2>
              <p className="text-gray-600">{curso.descripcion}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Lecciones</h2>
              <div className="space-y-3">
                {curso.lecciones.map((leccion) => (
                  <div 
                    key={leccion.id} 
                    className={`p-4 border rounded-lg ${leccion.completada ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${leccion.completada ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {leccion.completada ? (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>{leccion.id}</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{leccion.titulo}</h3>
                        <p className="text-xs text-gray-500">{leccion.duracion}</p>
                      </div>
                      <div className="ml-auto">
                        <button
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            leccion.completada 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {leccion.completada ? 'Completada' : 'Comenzar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Volver a los cursos
              </button>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Marcar como completado
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Siguiente lección
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
