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
    },
  ]);
  const [editCurso, setEditCurso] = useState(null);

  const handleEdit = (curso) => {
    setTab('nuevo');
    setEditCurso(curso);
  };

  const handleSave = (cursoData) => {
    if (editCurso) {
      setCursos(cursos.map(c => c.id === editCurso.id ? { ...cursoData, id: editCurso.id } : c));
    } else {
      setCursos([...cursos, { ...cursoData, id: Date.now() }]);
    }
    setEditCurso(null);
    setTab('cursos');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Panel de Instructor</h1>
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${tab === 'cursos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => { setTab('cursos'); setEditCurso(null); }}
          >
            Mis Cursos
          </button>
          <button
            className={`px-4 py-2 rounded ${tab === 'nuevo' && !editCurso ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => { setTab('nuevo'); setEditCurso(null); }}
          >
            Crear Curso
          </button>
        </div>
        {tab === 'cursos' && <MisCursos cursos={cursos} onEdit={handleEdit} />}
        {tab === 'nuevo' && <CrearCurso onSave={handleSave} curso={editCurso} />}
      </div>
    </div>
  );
}

function MisCursos({ cursos, onEdit }) {
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
            </div>
          </li>
        ))}
      </ul>
    </div>
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
