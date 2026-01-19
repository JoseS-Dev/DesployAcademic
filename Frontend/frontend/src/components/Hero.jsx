const Hero = ({ onSignupClick }) => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-32 px-5 flex items-center justify-center animate-fade-in-up">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-gray-900">
          La escuela de tecnología<br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            de Latinoamérica
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Más de 50,000 estudiantes aprenden programación, bases de datos y frameworks modernos en DesployAcademic
        </p>
        <div className="flex gap-5 justify-center flex-wrap mb-16">
          <button
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            onClick={onSignupClick}
          >
            Comenzar Gratis
          </button>
          <button
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-bold hover:border-blue-600 hover:text-blue-600 transition"
            onClick={() => {
              const el = document.getElementById('courses');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else window.location.hash = 'courses';
            }}
          >
            Explorar Cursos
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

