import React from 'react';

const founders = [
  { name: 'José Santana', role: 'CEO', img: '/founder-jose-santana.png' },
  { name: 'Juan Ruiz', role: 'Vicepresidente', img: '/founder-juan-ruiz.png' },
  { name: 'Cristian Guevara', role: 'Director Comercial', img: '/founder-cristian-guevara.png' },
  { name: 'Edlizabeth Ponce', role: 'Marketing', img: '/founder-edlizabeth-ponce.png' },
  { name: 'Emilio Uzcategui', role: 'Tecnología', img: '/founder-emilio-uzcategui.png' },
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
                className="founder-img"
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
