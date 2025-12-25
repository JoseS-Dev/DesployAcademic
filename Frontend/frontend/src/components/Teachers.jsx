import { profesores } from '../data';

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
          {profesores.map((profesor) => (
            <div
              key={profesor.id}
              className="border-2 border-gray-200 rounded-2xl p-6 text-center transition-all duration-300 hover:border-blue-600 hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br from-blue-50/20 to-transparent shadow-md animate-fade-in-up"
            >
              <div className="mb-4 flex justify-center">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profesor.nombre}`}
                  alt={profesor.nombre}
                  className="w-30 h-30 rounded-full border-4 border-blue-600 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-900">{profesor.nombre}</h3>
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
              <div className="flex gap-4 justify-center">
                <button className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-transform hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </button>
                <button className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-transform hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.348c-.009.014-.021.033-.033.05h.033v-.05c.418-.645 1.162-1.571 2.828-1.571 2.065 0 3.613 1.349 3.613 4.25v5.619zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.704 0-.951.77-1.704 1.956-1.704 1.187 0 1.915.753 1.948 1.704 0 .946-.76 1.704-1.989 1.704zm1.582 11.597H3.635V9.861h3.284v10.591zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-transform hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 002.856-10.986c-1.475.493-3.031.992-4.61 1.494a4.948 4.948 0 00-8.86 4.5c-4.165-2.383-7.846-4.566-10.548-9.172a4.929 4.929 0 001.525 6.573 4.888 4.888 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.900 9.900 0 010 19.54a13.994 13.994 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Teachers;

