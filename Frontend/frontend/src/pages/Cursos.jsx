import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cursosAPI, categoriasAPI } from '../services/api';

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarCategorias();
    cargarCursos();
  }, []);

  useEffect(() => {
    cargarCursos();
  }, [categoriaSeleccionada, busqueda]);

  const cargarCategorias = async () => {
    try {
      const data = await categoriasAPI.getAll();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoriaSeleccionada) {
        params.categoria = categoriaSeleccionada;
      }
      if (busqueda) {
        params.busqueda = busqueda;
      }
      
      const data = await cursosAPI.getAll(params);
      setCursos(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error al cargar los cursos');
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId === categoriaSeleccionada ? null : categoriaId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nuestros Cursos
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Aprende las habilidades más demandadas en la industria tecnológica.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoriaChange(null)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  !categoriaSeleccionada
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todas
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => handleCategoriaChange(categoria.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    categoriaSeleccionada === categoria.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {cursos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron cursos.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {curso.imagen && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={curso.imagen}
                      alt={curso.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!curso.imagen && (
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {curso.titulo.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-2">
                      {curso.categoria && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {curso.categoria.nombre || curso.categoria}
                        </span>
                      )}
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {curso.nivel}
                      </span>
                    </div>
                  </div>
                  
                  <Link to={`/curso/${curso.id}`} className="block">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
                      {curso.titulo}
                    </h3>
                  </Link>
                  
                  <p className="text-base text-gray-500 mb-4 line-clamp-2">
                    {curso.descripcion}
                  </p>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    {curso.instructor && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {curso.instructor.nombre || curso.instructor}
                      </span>
                    )}
                    {curso.duracion && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {curso.duracion}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    {curso.calificacion && (
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="text-sm font-medium">{curso.calificacion}</span>
                      </div>
                    )}
                    <div className="text-right">
                      {curso.precio === 0 || curso.precio === null ? (
                        <span className="text-green-600 font-semibold">Gratis</span>
                      ) : (
                        <span className="text-blue-600 font-semibold">${curso.precio}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/curso/${curso.id}`}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      Ver curso
                    </Link>
                    {usuarioActual?.plan === 'gratuito' && (
                      <Link
                        to="/suscripcion"
                        className="px-3 py-2 text-xs font-medium text-green-600 hover:text-green-800 border border-green-600 rounded-md hover:bg-green-50 transition"
                      >
                        Profesional
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
