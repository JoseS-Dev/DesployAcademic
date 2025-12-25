import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inscripcionesAPI } from '../services/api';

export default function Dashboard() {
  const { usuarioActual } = useAuth();
  const [misCursos, setMisCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuarioActual) {
      cargarMisCursos();
    }
  }, [usuarioActual]);

  const cargarMisCursos = async () => {
    try {
      setLoading(true);
      const data = await inscripcionesAPI.getMisInscripciones();
      setMisCursos(data);
    } catch (err) {
      console.error('Error al cargar mis cursos:', err);
      setMisCursos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hola, {usuarioActual?.nombre || 'Usuario'}
          </h1>
          <p className="text-gray-600">Bienvenido a tu panel de control</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Tu Plan</h3>
            <p className="text-2xl font-bold text-gray-900">
              {usuarioActual?.plan
                ? usuarioActual.plan.charAt(0).toUpperCase() + usuarioActual.plan.slice(1)
                : 'No especificado'}
            </p>
            <Link
              to="/suscripcion"
              className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Actualizar plan →
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Cursos inscritos</h3>
            <p className="text-2xl font-bold text-gray-900">{misCursos.length}</p>
            <Link
              to="/cursos"
              className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todos los cursos →
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Progreso</h3>
            <p className="text-2xl font-bold text-gray-900">
              {misCursos.filter(c => c.progreso > 0).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Cursos en progreso</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mis Cursos</h2>
            <Link
              to="/cursos"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explorar más cursos →
            </Link>
          </div>

          {misCursos.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes cursos inscritos</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza explorando nuestros cursos disponibles.
              </p>
              <div className="mt-6">
                <Link
                  to="/cursos"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Explorar cursos
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {misCursos.map((inscripcion) => {
                const curso = inscripcion.curso || inscripcion;
                const progreso = inscripcion.progreso || 0;

                return (
                  <div
                    key={inscripcion.id || curso.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {curso.imagen && (
                      <div className="h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={curso.imagen}
                          alt={curso.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {curso.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {curso.descripcion}
                      </p>

                      {progreso > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{progreso}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${progreso}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <Link
                        to={`/curso/${curso.id}`}
                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        {progreso > 0 ? 'Continuar' : 'Comenzar'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
