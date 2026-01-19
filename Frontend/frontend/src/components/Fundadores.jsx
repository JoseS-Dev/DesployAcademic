import React from 'react';

// Importar imágenes desde assets
import Founder1 from '../assets/Founder-1.jpeg';
import Founder2 from '../assets/Founder-2.jpeg';
import Founder3 from '../assets/Founder-3.jpeg';
import Founder4 from '../assets/Founder-4.jpeg';
// Nota: el archivo 5 está con tipografía "Foudner-5.jpeg" en assets
import Founder5 from '../assets/Foudner-5.jpeg';

// Mapear imágenes a los fundadores (orden asumido 1→5)
const founders = [
  { name: 'José Santana', role: 'CEO', img: Founder3 },
  { name: 'Juan Ruiz', role: 'Vicepresidente', img: Founder4 },
  { name: 'Cristian Guevara', role: 'Director Comercial', img: Founder2 },
  { name: 'Edlizabeth Ponce', role: 'Marketing', img: Founder1 },
  { name: 'Emilio Uzcategui', role: 'Tecnología', img: Founder5 },
];

const Fundadores = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Conoce a los Fundadores</h2>
          <p className="mt-2 text-gray-600">Equipo de expertos que lideran DesployAcademic</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
          {founders.map((f) => (
            <div key={f.name} className="mission-founder flex flex-col items-center">
              <img
                src={f.img}
                alt={f.name}
                className="founder-img w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover object-center border border-gray-200 shadow"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    f.name
                  )}&background=ffd54a&color=fff&size=200`;
                }}
              />
              <span className="founder-name mt-2 text-center">{f.name}</span>
              <span className="founder-role">{f.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fundadores;
