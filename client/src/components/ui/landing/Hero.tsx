import {Link} from 'react-router-dom';
const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-white py-32 px-5 flex items-center justify-center animate-fade-in-up">
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
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold 
            hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Comenzar Gratis
          </Link>
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
        <div className="flex justify-center gap-12 flex-wrap">
          <div className="text-center">
            <strong className="text-3xl text-blue-600 block">50K+</strong>
            <span className="text-gray-600 text-sm">Estudiantes activos</span>
          </div>
          <div className="text-center">
            <strong className="text-3xl text-blue-600 block">100+</strong>
            <span className="text-gray-600 text-sm">Cursos disponibles</span>
          </div>
          <div className="text-center">
            <strong className="text-3xl text-blue-600 block">4.9★</strong>
            <span className="text-gray-600 text-sm">Calificación promedio</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

