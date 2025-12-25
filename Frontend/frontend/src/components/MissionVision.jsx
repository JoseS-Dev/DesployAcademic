const MissionVision = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-5 animate-fade-in-up">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="p-10 bg-white border-2 border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-400 transition hover:-translate-y-1 shadow-md">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">Nuestra Misión</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Democratizar la educación tecnológica de calidad, brindando acceso a recursos de aprendizaje de primer nivel para desarrolladores de todas las edades y orígenes.
          </p>
        </div>
        <div className="p-10 bg-white border-2 border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-400 transition hover:-translate-y-1 shadow-md">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">Nuestra Visión</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Ser la plataforma educativa líder en Latinoamérica, transformando vidas a través de la tecnología y creando una comunidad global de desarrolladores innovadores.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;

