import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cursosAPI, seccionesAPI, leccionesAPI, recursosAPI, reseñasAPI, inscripcionesAPI } from '../services/api';

export default function CursoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioActual, isAuthenticated } = useAuth();
  
  const [curso, setCurso] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [leccionSeleccionada, setLeccionSeleccionada] = useState(null);
  const [recursos, setRecursos] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [estaInscrito, setEstaInscrito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarReseñas, setMostrarReseñas] = useState(false);
  const [nuevaReseña, setNuevaReseña] = useState({ calificacion: 5, comentario: '' });
  const [seccionExpandida, setSeccionExpandida] = useState(null);

  useEffect(() => {
    cargarCurso();
  }, [id]);

  useEffect(() => {
    if (curso && isAuthenticated) {
      verificarInscripcion();
      cargarReseñas();
    }
  }, [curso, isAuthenticated]);

  useEffect(() => {
    if (curso) {
      cargarSecciones();
    }
  }, [curso]);

  const cargarCurso = async () => {
    try {
      setLoading(true);
      const data = await cursosAPI.getById(id);
      setCurso(data);
    } catch (err) {
      setError(err.message || 'Error al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

  const cargarSecciones = async () => {
    try {
      const data = await seccionesAPI.getByCurso(id);
      setSecciones(data);
    } catch (err) {
      console.error('Error al cargar secciones:', err);
    }
  };

  const cargarLecciones = async (seccionId) => {
    try {
      const lecciones = await leccionesAPI.getBySeccion(id, seccionId);
      return lecciones;
    } catch (err) {
      console.error('Error al cargar lecciones:', err);
      return [];
    }
  };

  const cargarRecursos = async (seccionId, leccionId) => {
    try {
      const recursosData = await recursosAPI.getByLeccion(id, seccionId, leccionId);
      setRecursos(recursosData);
    } catch (err) {
      console.error('Error al cargar recursos:', err);
    }
  };

  const cargarReseñas = async () => {
    try {
      const data = await reseñasAPI.getByCurso(id);
      setReseñas(data);
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    }
  };

  const verificarInscripcion = async () => {
    try {
      const inscripcion = await inscripcionesAPI.getInscripcion(id);
      setEstaInscrito(!!inscripcion);
    } catch (err) {
      setEstaInscrito(false);
    }
  };

  const handleInscribirse = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/curso/${id}` } });
      return;
    }

    try {
      await inscripcionesAPI.inscribirse(id);
      setEstaInscrito(true);
      alert('¡Te has inscrito exitosamente en el curso!');
    } catch (err) {
      alert(err.message || 'Error al inscribirse en el curso');
    }
  };

  const handleVerLeccion = async (seccionId, leccionId) => {
    if (!estaInscrito) {
      alert('Debes estar inscrito en el curso para ver las lecciones');
      return;
    }

    try {
      const leccion = await leccionesAPI.getById(id, seccionId, leccionId);
      setLeccionSeleccionada({ ...leccion, seccionId, leccionId });
      await cargarRecursos(seccionId, leccionId);
    } catch (err) {
      alert('Error al cargar la lección');
    }
  };

  const handleEnviarReseña = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await reseñasAPI.create(id, nuevaReseña);
      setNuevaReseña({ calificacion: 5, comentario: '' });
      await cargarReseñas();
      setMostrarReseñas(false);
      alert('Reseña enviada exitosamente');
    } catch (err) {
      alert(err.message || 'Error al enviar la reseña');
    }
  };

  const toggleSeccion = async (seccionId) => {
    if (seccionExpandida === seccionId) {
      setSeccionExpandida(null);
    } else {
      setSeccionExpandida(seccionId);
      // Cargar lecciones si no están cargadas
      const seccion = secciones.find(s => s.id === seccionId);
      if (seccion && !seccion.lecciones) {
        const lecciones = await cargarLecciones(seccionId);
        setSecciones(prev => prev.map(s => 
          s.id === seccionId ? { ...s, lecciones } : s
        ));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Curso no encontrado'}</p>
          <button
            onClick={() => navigate('/cursos')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header del curso */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{curso.titulo}</h1>
                <p className="text-blue-100">{curso.instructor?.nombre || 'Instructor'}</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                    {curso.nivel}
                  </span>
                  {curso.categoria && (
                    <span className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                      {curso.categoria.nombre}
                    </span>
                  )}
                </div>
              </div>
              {!estaInscrito && isAuthenticated && (
                <button
                  onClick={handleInscribirse}
                  className="ml-4 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                >
                  Inscribirse
                </button>
              )}
              {estaInscrito && (
                <span className="ml-4 px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg">
                  Inscrito
                </span>
              )}
            </div>
          </div>
          
          <div className="px-6 py-5">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Descripción del curso</h2>
            <p className="text-gray-600">{curso.descripcion}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {leccionSeleccionada ? (
              <div className="bg-white shadow rounded-lg p-6">
                <button
                  onClick={() => setLeccionSeleccionada(null)}
                  className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver a las secciones
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{leccionSeleccionada.titulo}</h2>
                <p className="text-gray-600 mb-6">{leccionSeleccionada.descripcion}</p>
                
                {leccionSeleccionada.videoUrl && (
                  <div className="mb-6">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <iframe
                        src={leccionSeleccionada.videoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        title={leccionSeleccionada.titulo}
                      />
                    </div>
                  </div>
                )}

                {recursos.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recursos</h3>
                    <div className="space-y-2">
                      {recursos.map((recurso) => (
                        <a
                          key={recurso.id}
                          href={recurso.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">{recurso.nombre}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contenido del curso</h2>
                
                {!estaInscrito ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">Debes estar inscrito para ver el contenido del curso</p>
                    <button
                      onClick={handleInscribirse}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Inscribirse ahora
                    </button>
                  </div>
                ) : secciones.length === 0 ? (
                  <p className="text-gray-500">Este curso aún no tiene contenido disponible.</p>
                ) : (
                  <div className="space-y-3">
                    {secciones.map((seccion) => (
                      <div key={seccion.id} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleSeccion(seccion.id)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <svg
                              className={`w-5 h-5 text-gray-400 mr-3 transition-transform ${
                                seccionExpandida === seccion.id ? 'transform rotate-90' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium text-gray-900">{seccion.titulo}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {seccion.lecciones?.length || 0} lecciones
                          </span>
                        </button>
                        
                        {seccionExpandida === seccion.id && seccion.lecciones && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            {seccion.lecciones.map((leccion) => (
                              <button
                                key={leccion.id}
                                onClick={() => handleVerLeccion(seccion.id, leccion.id)}
                                className="w-full px-8 py-3 text-left hover:bg-gray-100 flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-gray-700">{leccion.titulo}</span>
                                </div>
                                <span className="text-sm text-gray-500">{leccion.duracion || 'N/A'}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reseñas */}
            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Reseñas</h2>
                {isAuthenticated && estaInscrito && (
                  <button
                    onClick={() => setMostrarReseñas(!mostrarReseñas)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {mostrarReseñas ? 'Cancelar' : 'Escribir reseña'}
                  </button>
                )}
              </div>

              {mostrarReseñas && (
                <form onSubmit={handleEnviarReseña} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                    <select
                      value={nuevaReseña.calificacion}
                      onChange={(e) => setNuevaReseña({ ...nuevaReseña, calificacion: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>{num} estrellas</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comentario</label>
                    <textarea
                      value={nuevaReseña.comentario}
                      onChange={(e) => setNuevaReseña({ ...nuevaReseña, comentario: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="4"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Enviar reseña
                  </button>
                </form>
              )}

              {reseñas.length === 0 ? (
                <p className="text-gray-500">Aún no hay reseñas para este curso.</p>
              ) : (
                <div className="space-y-4">
                  {reseñas.map((reseña) => (
                    <div key={reseña.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < reseña.calificacion ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">{reseña.usuario?.nombre || 'Usuario'}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(reseña.fechaCreacion).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{reseña.comentario}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del curso</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nivel:</span>
                  <span className="font-medium">{curso.nivel}</span>
                </div>
                {curso.duracion && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-medium">{curso.duracion}</span>
                  </div>
                )}
                {curso.precio !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio:</span>
                    <span className="font-medium">
                      {curso.precio === 0 ? 'Gratis' : `$${curso.precio}`}
                    </span>
                  </div>
                )}
                {curso.estudiantes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estudiantes:</span>
                    <span className="font-medium">{curso.estudiantes}</span>
                  </div>
                )}
              </div>
              
              {!isAuthenticated && (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/login', { state: { from: `/curso/${id}` } })}
                    className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Inicia sesión para inscribirte
                  </button>
                  <button
                    onClick={() => navigate('/suscripcion')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Ver planes Premium
                  </button>
                </div>
              )}
              {isAuthenticated && usuarioActual?.plan === 'gratuito' && !estaInscrito && (
                <button
                  onClick={() => navigate('/suscripcion')}
                  className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600"
                >
                  Mejorar a Premium
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
