import { useState } from 'react';
import { videos } from '../data';

const VideoCarousel = () => {
  const [indiceVideoActual, setIndiceVideoActual] = useState(0);
  const [videoReproduciendo, setVideoReproduciendo] = useState(false);

  const video = videos[indiceVideoActual];

  const cambiarVideo = (indice) => {
    setIndiceVideoActual(indice);
    setVideoReproduciendo(false);
  };

  const videoAnterior = () => {
    setIndiceVideoActual((prev) => (prev - 1 + videos.length) % videos.length);
    setVideoReproduciendo(false);
  };

  const videoSiguiente = () => {
    setIndiceVideoActual((prev) => (prev + 1) % videos.length);
    setVideoReproduciendo(false);
  };

  const reproducirVideo = () => {
    setVideoReproduciendo(true);
  };

  return (
    <section className="bg-white py-20 px-5 shadow-sm animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Contenido Exclusivo</span>
          <h2 className="text-5xl font-black mt-4 mb-4 text-gray-900">Aprende con Videos Profesionales</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubre tutoriales de calidad sobre programación, bases de datos y frameworks modernos
          </p>
        </div>

        {/* Reproductor Principal */}
        <div className="mb-10">
          <div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl border-2 border-gray-200 overflow-hidden relative mb-5 shadow-md">
            {videoReproduciendo ? (
              <iframe
                className="w-full h-full"
                src={`${video.videoUrl}?autoplay=1`}
                title={video.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div
                className="video-placeholder cursor-pointer w-full h-full flex flex-col items-center justify-center gap-5"
                onClick={reproducirVideo}
              >
                <svg width="60" height="60" viewBox="0 0 24 24" fill="#0066ff">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span className="absolute bottom-5 right-5 bg-gray-900/80 text-white px-3 py-1 rounded text-xs font-semibold">
                  {video.duracion}
                </span>
              </div>
            )}
          </div>
          <h3 className="text-3xl font-bold mb-2 text-gray-900">{video.titulo}</h3>
          <p className="text-gray-600 text-lg mb-4">{video.descripcion}</p>
          <div className="flex gap-4">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-semibold">
              Video {indiceVideoActual + 1} de {videos.length}
            </span>
          </div>
        </div>

        {/* Controles de Navegación */}
        <div className="flex items-center justify-between mb-10">
          <button
            className="w-12 h-12 border-2 border-gray-300 rounded-full hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center text-xl text-gray-700 font-bold"
            onClick={videoAnterior}
          >
            ←
          </button>
          <div className="flex gap-3 justify-center">
            {videos.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full transition ${
                  i === indiceVideoActual ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => cambiarVideo(i)}
              />
            ))}
          </div>
          <button
            className="w-12 h-12 border-2 border-gray-300 rounded-full hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center text-xl text-gray-700 font-bold"
            onClick={videoSiguiente}
          >
            →
          </button>
        </div>

        {/* Listado de Videos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videos.map((v, i) => (
            <button
              key={v.id}
              className={`text-left p-4 border-2 rounded-xl transition ${
                i === indiceVideoActual
                  ? 'border-blue-600 bg-blue-100'
                  : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => cambiarVideo(i)}
            >
              <span className="text-xs text-gray-500 font-semibold">Video {i + 1}</span>
              <h4 className="font-bold text-base mt-2 text-gray-900">{v.titulo}</h4>
              <p className="text-gray-600 text-sm mt-1">{v.descripcion}</p>
              <span className="text-xs text-gray-500 block mt-2">{v.duracion}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;

