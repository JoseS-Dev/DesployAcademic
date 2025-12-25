import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { cursosAPI, categoriasAPI, seccionesAPI, leccionesAPI } from '../services/api';

export default function InstructorPanel() {
  const { usuarioActual } = useAuth();
  const [tab, setTab] = useState('cursos');
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);

  useEffect(() => {
    cargarCategorias();
    cargarCursos();
  }, []);

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
      // En una app real, esto debería filtrar por instructor
      const data = await cursosAPI.getAll();
      setCursos(data);
    } catch (err) {
      console.error('Error al cargar cursos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCurso = async (cursoData) => {
    try {
      await cursosAPI.create(cursoData);
      await cargarCursos();
      setTab('cursos');
      alert('Curso creado exitosamente');
    } catch (err) {
      alert(err.message || 'Error al crear el curso');
    }
  };

  const handleEditarCurso = async (id, cursoData) => {
    try {
      await cursosAPI.update(id, cursoData);
      await cargarCursos();
      setTab('cursos');
      alert('Curso actualizado exitosamente');
    } catch (err) {
      alert(err.message || 'Error al actualizar el curso');
    }
  };

  const handleEliminarCurso = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;
    try {
      await cursosAPI.delete(id);
      await cargarCursos();
      alert('Curso eliminado exitosamente');
    } catch (err) {
      alert(err.message || 'Error al eliminar el curso');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (seccionSeleccionada) {
    return (
      <LeccionesPanel
        curso={cursoSeleccionado}
        seccion={seccionSeleccionada}
        onBack={() => setSeccionSeleccionada(null)}
      />
    );
  }

  if (cursoSeleccionado) {
    return (
      <SeccionesPanel
        curso={cursoSeleccionado}
        onBack={() => setCursoSeleccionado(null)}
        onSeleccionarSeccion={setSeccionSeleccionada}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Panel de Instructor</h1>
        
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === 'cursos'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setTab('cursos')}
          >
            Mis Cursos
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === 'nuevo'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setTab('nuevo')}
          >
            Crear Curso
          </button>
        </div>

        {tab === 'cursos' ? (
          <MisCursos
            cursos={cursos}
            onEditar={(curso) => {
              setCursoSeleccionado(curso);
              setTab('editar');
            }}
            onEliminar={handleEliminarCurso}
            onGestionarContenido={setCursoSeleccionado}
          />
        ) : (
          <CrearCurso
            categorias={categorias}
            onSave={handleCrearCurso}
            onCancel={() => setTab('cursos')}
          />
        )}
      </div>
    </div>
  );
}

function MisCursos({ cursos, onEditar, onEliminar, onGestionarContenido }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Tus Cursos</h2>
      {cursos.length === 0 ? (
        <p className="text-gray-500">No tienes cursos creados aún.</p>
      ) : (
        <div className="space-y-4">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{curso.titulo}</h3>
                  <p className="text-sm text-gray-600 mt-1">{curso.descripcion}</p>
                  <div className="flex gap-2 mt-2">
                    {curso.categoria && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {curso.categoria.nombre || curso.categoria}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {curso.nivel}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      ${curso.precio || 0}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onGestionarContenido(curso)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  >
                    Contenido
                  </button>
                  <button
                    onClick={() => onEditar(curso)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(curso.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SeccionesPanel({ curso, onBack, onSeleccionarSeccion }) {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [seccionEditando, setSeccionEditando] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '', orden: 0 });

  useEffect(() => {
    cargarSecciones();
  }, [curso.id]);

  const cargarSecciones = async () => {
    try {
      setLoading(true);
      const data = await seccionesAPI.getByCurso(curso.id);
      setSecciones(data);
    } catch (err) {
      console.error('Error al cargar secciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (seccionEditando) {
        await seccionesAPI.update(curso.id, seccionEditando.id, formData);
        alert('Sección actualizada exitosamente');
      } else {
        await seccionesAPI.create(curso.id, formData);
        alert('Sección creada exitosamente');
      }
      await cargarSecciones();
      setMostrarFormulario(false);
      setSeccionEditando(null);
      setFormData({ titulo: '', descripcion: '', orden: 0 });
    } catch (err) {
      alert(err.message || 'Error al guardar la sección');
    }
  };

  const handleEditar = (seccion) => {
    setSeccionEditando(seccion);
    setFormData({ titulo: seccion.titulo, descripcion: seccion.descripcion || '', orden: seccion.orden || 0 });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return;
    try {
      await seccionesAPI.delete(curso.id, id);
      await cargarSecciones();
      alert('Sección eliminada exitosamente');
    } catch (err) {
      alert(err.message || 'Error al eliminar la sección');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mb-2">
            ← Volver a cursos
          </button>
          <h2 className="text-xl font-semibold">Secciones: {curso.titulo}</h2>
        </div>
        <button
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setSeccionEditando(null);
            setFormData({ titulo: '', descripcion: '', orden: 0 });
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {mostrarFormulario ? 'Cancelar' : 'Nueva Sección'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">
            {seccionEditando ? 'Editar Sección' : 'Nueva Sección'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                value={formData.orden}
                onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {seccionEditando ? 'Guardar Cambios' : 'Crear Sección'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando secciones...</p>
      ) : secciones.length === 0 ? (
        <p className="text-gray-500">No hay secciones creadas aún.</p>
      ) : (
        <div className="space-y-3">
          {secciones.map((seccion) => (
            <div
              key={seccion.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{seccion.titulo}</h3>
                  {seccion.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{seccion.descripcion}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onSeleccionarSeccion(seccion)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  >
                    Lecciones
                  </button>
                  <button
                    onClick={() => handleEditar(seccion)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(seccion.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeccionesPanel({ curso, seccion, onBack }) {
  const [lecciones, setLecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [leccionEditando, setLeccionEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    videoUrl: '',
    duracion: '',
    orden: 0,
  });

  useEffect(() => {
    cargarLecciones();
  }, [curso.id, seccion.id]);

  const cargarLecciones = async () => {
    try {
      setLoading(true);
      const data = await leccionesAPI.getBySeccion(curso.id, seccion.id);
      setLecciones(data);
    } catch (err) {
      console.error('Error al cargar lecciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (leccionEditando) {
        await leccionesAPI.update(curso.id, seccion.id, leccionEditando.id, formData);
        alert('Lección actualizada exitosamente');
      } else {
        await leccionesAPI.create(curso.id, seccion.id, formData);
        alert('Lección creada exitosamente');
      }
      await cargarLecciones();
      setMostrarFormulario(false);
      setLeccionEditando(null);
      setFormData({ titulo: '', descripcion: '', videoUrl: '', duracion: '', orden: 0 });
    } catch (err) {
      alert(err.message || 'Error al guardar la lección');
    }
  };

  const handleEditar = (leccion) => {
    setLeccionEditando(leccion);
    setFormData({
      titulo: leccion.titulo,
      descripcion: leccion.descripcion || '',
      videoUrl: leccion.videoUrl || '',
      duracion: leccion.duracion || '',
      orden: leccion.orden || 0,
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta lección?')) return;
    try {
      await leccionesAPI.delete(curso.id, seccion.id, id);
      await cargarLecciones();
      alert('Lección eliminada exitosamente');
    } catch (err) {
      alert(err.message || 'Error al eliminar la lección');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mb-2">
            ← Volver a secciones
          </button>
          <h2 className="text-xl font-semibold">Lecciones: {seccion.titulo}</h2>
        </div>
        <button
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setLeccionEditando(null);
            setFormData({ titulo: '', descripcion: '', videoUrl: '', duracion: '', orden: 0 });
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {mostrarFormulario ? 'Cancelar' : 'Nueva Lección'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">
            {leccionEditando ? 'Editar Lección' : 'Nueva Lección'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL del Video</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                <input
                  type="text"
                  value={formData.duracion}
                  onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: 15 min"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                <input
                  type="number"
                  value={formData.orden}
                  onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {leccionEditando ? 'Guardar Cambios' : 'Crear Lección'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando lecciones...</p>
      ) : lecciones.length === 0 ? (
        <p className="text-gray-500">No hay lecciones creadas aún.</p>
      ) : (
        <div className="space-y-3">
          {lecciones.map((leccion) => (
            <div
              key={leccion.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{leccion.titulo}</h3>
                  {leccion.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{leccion.descripcion}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {leccion.duracion && (
                      <span className="text-xs text-gray-500">⏱️ {leccion.duracion}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditar(leccion)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(leccion.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CrearCurso({ categorias, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoriaId: '',
    precio: 0,
    nivel: 'Básico',
    imagen: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    setFormData({
      titulo: '',
      descripcion: '',
      categoriaId: '',
      precio: 0,
      nivel: 'Básico',
      imagen: '',
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Crear Nuevo Curso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={formData.categoriaId}
              onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
            <select
              value={formData.nivel}
              onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input
            type="number"
            min="0"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
          <input
            type="url"
            value={formData.imagen}
            onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Crear Curso
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
