import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cursos } from '../data';

const Courses = ({ onSignupClick }) => {
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  // Mapea cursos a enlaces de videos en YouTube de canales conocidos
  const getVideoLink = (titulo, categoria) => {
    const t = (titulo || '').toLowerCase();
    const c = (categoria || '').toLowerCase();

    if (t.includes('javascript')) return 'https://www.youtube.com/results?search_query=midudev+javascript+curso';
    if (t.includes('react')) return 'https://www.youtube.com/results?search_query=midudev+react+curso';
    if (t.includes('sql')) return 'https://www.youtube.com/results?search_query=todocode+sql+curso';
    if (t.includes('node')) return 'https://www.youtube.com/results?search_query=fazt+node+curso';
    if (t.includes('vue')) return 'https://www.youtube.com/results?search_query=fazt+vue+curso';
    if (t.includes('docker') || c.includes('devops')) return 'https://www.youtube.com/results?search_query=midudev+docker+curso';

    // Fallback general a canales sugeridos
    return 'https://www.youtube.com/@midudev';
  };

  // Mapea cursos a imágenes de referencia (logos oficiales vía Devicon CDN)
  const getCourseImage = (titulo, categoria) => {
    const t = (titulo || '').toLowerCase();
    const c = (categoria || '').toLowerCase();

    if (t.includes('javascript')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg';
    if (t.includes('react')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg';
    if (t.includes('node')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg';
    if (t.includes('vue')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg';
    if (t.includes('docker') || c.includes('devops')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg';
    if (t.includes('sql') || c.includes('backend')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg';

    return null;
  };

  // Navegación al detalle se elimina: siempre mostramos enlace a YouTube

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
          {cursos.map((curso) => {
            const imageUrl = getCourseImage(curso.titulo, curso.categoria) || curso.imagen;
            return (
              <div
                key={curso.id}
                className="border-2 border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-600 hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br from-blue-50/20 to-transparent shadow-md animate-fade-in-up"
              >
                <div
                  className="h-48 bg-cover bg-center relative group"
                  style={{ backgroundImage: `url(${imageUrl})` }}
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
                    <a
                      href={getVideoLink(curso.titulo, curso.categoria)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`flex-1 py-3 rounded-lg font-semibold transition bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg hover:scale-105 text-center`}
                    >
                      Ver en YouTube
                    </a>
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Courses;
