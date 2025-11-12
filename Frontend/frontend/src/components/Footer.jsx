const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 py-16 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
          <div>
            <h4 className="text-base font-bold mb-4 text-gray-400">Sobre DesployAcademic</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                  Carreras
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-bold mb-4 text-gray-400">Producto</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                  Cursos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                  Precios
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                  Certificados
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-bold mb-4 text-gray-400">Comunidad</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                  Foro
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-bold mb-4 text-gray-400">Contacto</h4>
            <p className="text-gray-400 text-sm mb-2">Email: info@deployacademic.com</p>
            <p className="text-gray-400 text-sm">Teléfono: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 DesployAcademic. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

