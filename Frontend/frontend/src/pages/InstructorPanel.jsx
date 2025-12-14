import React, { useState } from 'react';

export default function InstructorPanel() {
  const [tab, setTab] = useState('cursos');
  const [cursos, setCursos] = useState([
    {
      id: 1,
      titulo: 'React Avanzado',
      descripcion: 'Curso avanzado de React',
      categoria: 'Programación',
      imagen: '',
      precio: 0,
      nivel: 'Intermedio',
      estado: 'Publicado',
      lecciones: [
        { id: 1, titulo: 'Introducción a React', video: '', descripcion: 'Lección introductoria' },
        { id: 2, titulo: 'Hooks en Profundidad', video: '', descripcion: 'Uso avanzado de hooks' },
      ],
    },
    {
      id: 2,
      titulo: 'Node.js desde cero',
      descripcion: 'Aprende Node.js desde cero',
      categoria: 'Backend',
      imagen: '',
      precio: 10,
      nivel: 'Básico',
      estado: 'Borrador',
      lecciones: [
        { id: 1, titulo: 'Instalación de Node', video: '', descripcion: 'Cómo instalar Node.js' },
      ],
    },
  ]);
  const [editCurso, setEditCurso] = useState(null);
  const [leccionesCurso, setLeccionesCurso] = useState(null); // curso seleccionado para ver/editar lecciones

  const handleEdit = (curso) => {
    setTab('nuevo');
    setEditCurso(curso);
  };

  const handleSave = (cursoData) => {
    if (editCurso) {
      setCursos(cursos.map(c => c.id === editCurso.id ? { ...cursoData, id: editCurso.id, lecciones: c.lecciones } : c));
    } else {
      setCursos([...cursos, { ...cursoData, id: Date.now(), lecciones: [] }]);
    }
    setEditCurso(null);
    setTab('cursos');
  };

  const handleLecciones = (curso) => {
    setLeccionesCurso(curso);
  };

  const handleSaveLeccion = (leccion) => {
    setCursos(cursos.map(c => {
      if (c.id === leccionesCurso.id) {
        if (leccion.id) {
          // editar
          return { ...c, lecciones: c.lecciones.map(l => l.id === leccion.id ? leccion : l) };
        } else {
          // crear
          return { ...c, lecciones: [...c.lecciones, { ...leccion, id: Date.now() }] };
        }
      }
      return c;
    }));
    setLeccionesCurso(c => ({ ...c, lecciones: c.lecciones.some(l => l.id === leccion.id) ? c.lecciones.map(l => l.id === leccion.id ? leccion : l) : [...c.lecciones, { ...leccion, id: Date.now() }] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Panel de Instructor</h1>
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${tab === 'cursos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => { setTab('cursos'); setEditCurso(null); setLeccionesCurso(null); }}
          >
            Mis Cursos
          </button>
          <button
            className={`px-4 py-2 rounded ${tab === 'nuevo' && !editCurso ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => { setTab('nuevo'); setEditCurso(null); setLeccionesCurso(null); }}
          >
            Crear Curso
          </button>
        </div>
        {leccionesCurso ? (
          <LeccionesPanel curso={leccionesCurso} onSave={handleSaveLeccion} onBack={() => setLeccionesCurso(null)} />
        ) : tab === 'cursos' ? (
          <MisCursos cursos={cursos} onEdit={handleEdit} onLecciones={handleLecciones} />
        ) : (
          <CrearCurso onSave={handleSave} curso={editCurso} />
        )}
      </div>
    </div>
  );
}

function MisCursos({ cursos, onEdit, onLecciones }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tus Cursos</h2>
      <ul className="divide-y divide-gray-200">
        {cursos.map(curso => (
          <li key={curso.id} className="py-4 flex items-center justify-between">
            <div>
              <span className="font-medium block">{curso.titulo}</span>
              <span className="text-xs text-gray-500 block">{curso.categoria} | {curso.nivel}</span>
              <span className="text-xs text-gray-500 block">Precio: ${curso.precio}</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${curso.estado === 'Publicado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{curso.estado}</span>
            <div className="flex gap-2">
              <button className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => onEdit(curso)}>Editar</button>
              <button className="ml-2 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600" onClick={() => onLecciones(curso)}>Lecciones</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LeccionesPanel({ curso, onSave, onBack }) {
  const [lecciones, setLecciones] = useState(curso.lecciones || []);
  const [editLeccion, setEditLeccion] = useState(null);

  const handleEdit = (leccion) => {
    setEditLeccion(leccion);
  };

  const handleSave = (leccionData) => {
    if (editLeccion) {
      setLecciones(lecciones.map(l => l.id === editLeccion.id ? { ...leccionData, id: editLeccion.id } : l));
    } else {
      setLecciones([...lecciones, { ...leccionData, id: Date.now() }]);
    }
    setEditLeccion(null);
    onSave({ ...leccionData, id: editLeccion ? editLeccion.id : Date.now() });
  };

  return (
    <div>
      <button className="mb-4 text-sm text-blue-600 hover:underline" onClick={onBack}>&larr; Volver a cursos</button>
      <h2 className="text-xl font-semibold mb-4">Lecciones de {curso.titulo}</h2>
      <ul className="divide-y divide-gray-200 mb-6">
        {lecciones.map(leccion => (
          <li key={leccion.id} className="py-3 flex items-center justify-between">
            <div>
              <span className="font-medium block">{leccion.titulo}</span>
              <span className="text-xs text-gray-500 block">{leccion.descripcion}</span>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleEdit(leccion)}>Editar</button>
            </div>
          </li>
        ))}
      </ul>
      <CrearLeccion onSave={handleSave} leccion={editLeccion} />
    </div>
  );
}

function CrearLeccion({ onSave, leccion }) {
  const [form, setForm] = useState({ titulo: '', descripcion: '', video: '' });

  React.useEffect(() => {
    if (leccion) {
      setForm(leccion);
    } else {
      setForm({ titulo: '', descripcion: '', video: '' });
    }
  }, [leccion]);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0]?.name || '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h3 className="text-lg font-semibold mb-2">{leccion ? 'Editar Lección' : 'Agregar Nueva Lección'}</h3>
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input name="titulo" value={form.titulo} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Video (nombre de archivo simulado)</label>
        <input name="video" type="file" onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
        {form.video && <span className="text-xs text-gray-500">{form.video}</span>}
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{leccion ? 'Guardar Cambios' : 'Agregar Lección'}</button>
    </form>
  );
}

function CrearCurso({ onSave, curso }) {
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    precio: '',
    nivel: 'Básico',
    estado: 'Borrador',
  });

  React.useEffect(() => {
    if (curso) {
      setForm({ ...curso, precio: String(curso.precio) });
    } else {
      setForm({
        titulo: '', descripcion: '', categoria: '', imagen: '', precio: '', nivel: 'Básico', estado: 'Borrador',
      });
    }
  }, [curso]);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0]?.name || '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ ...form, precio: Number(form.precio) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">{curso ? 'Editar Curso' : 'Crear Nuevo Curso'}</h2>
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input name="titulo" value={form.titulo} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Categoría</label>
        <input name="categoria" value={form.categoria} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Imagen (nombre de archivo simulado)</label>
        <input name="imagen" type="file" onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
        {form.imagen && <span className="text-xs text-gray-500">{form.imagen}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium">Precio</label>
        <input name="precio" type="number" min="0" value={form.precio} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Nivel</label>
        <select name="nivel" value={form.nivel} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Estado</label>
        <select name="estado" value={form.estado} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
          <option value="Publicado">Publicado</option>
          <option value="Borrador">Borrador</option>
        </select>
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{curso ? 'Guardar Cambios' : 'Crear Curso'}</button>
    </form>
  );
}
