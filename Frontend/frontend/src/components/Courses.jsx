import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cursos } from '../data';

const Courses = ({ onSignupClick }) => {
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  const accionCurso = (id) => {
    if (!usuarioActual) {
      onSignupClick();
    } else {
      navigate(`/curso/${id}`);
    }
  };

  return (
    <section id="courses" className="bg-white py-20 px-5 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Cursos Destacados</span>
          <h2 className="text-5xl font-black mt-4 mb-4 text-gray-900">Aprende con los Mejores Cursos</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Programación básica, intermedia y avanzada diseñada por expertos de la industria
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="border-2 border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-600 hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br from-blue-50/20 to-transparent shadow-md animate-fade-in-up"
            >
              <div
                className="h-48 bg-cover bg-center relative group"
                style={{ backgroundImage: `url(${curso.imagen})` }}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    {curso.categoria}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    {curso.nivel}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{curso.titulo}</h3>
                <p className="text-gray-600 text-sm mb-4">{curso.descripcion}</p>
                <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200 text-sm text-gray-600">
                  <span>👥 {(curso.estudiantes / 1000).toFixed(1)}k</span>
                  <span>⏱️ {curso.duracion}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-yellow-500">⭐ {curso.calificacion}</span>
                  <span className="text-blue-600 font-semibold">{curso.precio}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-3 rounded-lg font-semibold transition bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:scale-105`}
                    onClick={() => accionCurso(curso.id)}
                  >
                    {usuarioActual ? 'Ver curso' : 'Ver detalles'}
                  </button>
                  {usuarioActual?.plan === 'gratuito' && (
                    <button
                      onClick={() => navigate('/suscripcion')}
                      className="px-3 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 text-xs font-semibold"
                    >
                      Profesional
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
