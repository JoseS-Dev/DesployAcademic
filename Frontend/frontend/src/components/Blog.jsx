import { articulos } from '../data';

const Blog = () => {
  const leerBlog = (id) => {
    alert(`Leyendo artículo ${id}...`);
  };

  return (
    <section id="blog" className="bg-white py-20 px-5 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Blog</span>
          <h2 className="text-5xl font-black mt-4 mb-4 text-gray-900">Artículos y Tutoriales</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Aprende de expertos con consejos, guías y tendencias de la industria
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articulos.map((articulo) => (
            <div
              key={articulo.id}
              className="border-2 border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-600 hover:-translate-y-2 hover:shadow-xl shadow-md animate-fade-in-up"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop"
                  alt={articulo.titulo}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {articulo.categoria}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">{articulo.titulo}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{articulo.excerpt}</p>
                <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-200 text-xs text-gray-600">
                  <span>✍️ {articulo.autor}</span>
                  <span>📅 {articulo.fecha}</span>
                  <span>👁️ {articulo.vistas}</span>
                </div>
                <button
                  className="text-blue-600 bg-transparent border border-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition text-sm"
                  onClick={() => leerBlog(articulo.id)}
                >
                  Leer más →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;

