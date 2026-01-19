import { profesores } from '../data';

// Youtubers solicitados con avatar y redes
const youtubers = [
  {
    nombre: 'midudev',
    img: 'https://yt3.googleusercontent.com/QkJIZgFfiFacdK8syyPRt7cJYPl3jTf0qFhdPwFdpJpyCW5jI_uylNK5a3IH8bitE2wy6Dr2Lw=s900-c-k-c0x00ffffff-no-rj',
    links: {
      youtube: 'https://www.youtube.com/@midudev',
      x: 'https://twitter.com/midudev',
      github: 'https://github.com/midudev',
    },
  },
  {
    nombre: 'Fazt',
    img: 'https://yt3.googleusercontent.com/ytc/AIdro_nlI29kkP3d2OAKZTdDVgkDA6D7g7TfNvSKNBGTY-5cQHY=s900-c-k-c0x00ffffff-no-rj',
    links: {
      youtube: 'https://www.youtube.com/@FaztTech',
      x: 'https://twitter.com/FaztTech',
    },
  },
  {
    nombre: 'TodoCode',
    img: 'https://todocodeacademy.com/wp-content/uploads/2023/04/luisinadepaula.jpeg',
    links: {
      youtube: 'https://www.youtube.com/@TodoCode',
    },
  },
  {
    nombre: 'HolaMundo',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Yq2dOjhLl8V1sDyd3V9Q_itZqeLowf7p2A&s',
    links: {
      youtube: 'https://www.youtube.com/@HolaMundo',
    },
  },
];

const Teachers = () => {
  return (
    <section id="teachers" className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 px-5 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Nuestro Equipo</span>
          <h2 className="text-5xl font-black mt-4 mb-4 text-gray-900">Aprende de Expertos de la Industria</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Instructores con años de experiencia en empresas líderes de tecnología
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profesores.map((profesor, idx) => {
            const yt = youtubers[idx % youtubers.length];
            return (
              <div
                key={profesor.id}
                className="border-2 border-gray-200 rounded-2xl p-6 text-center transition-all duration-300 hover:border-blue-600 hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br from-blue-50/20 to-transparent shadow-md animate-fade-in-up"
              >
                <div className="mb-4 flex justify-center">
                  <img
                    src={yt.img}
                    alt={yt.nombre}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-blue-600 object-cover object-center transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-bold mb-1 text-gray-900">{yt.nombre}</h3>
                <p className="text-blue-600 font-semibold mb-4 text-sm">{profesor.rol}</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{profesor.bio}</p>
                <p className="text-blue-600 font-semibold mb-4 text-sm">{profesor.estudiantes} estudiantes</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {profesor.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {/* Redes sociales del youtuber */}
                <div className="flex items-center justify-center gap-4 mt-2 text-sm">
                  {yt?.links?.youtube && (
                    <a
                      href={yt.links.youtube}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-red-600 hover:underline"
                      aria-label={`YouTube de ${yt.nombre}`}
                    >
                      YouTube
                    </a>
                  )}
                  {yt?.links?.x && (
                    <a
                      href={yt.links.x}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-gray-900 hover:underline"
                      aria-label={`X/Twitter de ${yt.nombre}`}
                    >
                      X
                    </a>
                  )}
                  {yt?.links?.github && (
                    <a
                      href={yt.links.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-gray-800 hover:underline"
                      aria-label={`GitHub de ${yt.nombre}`}
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Teachers;

