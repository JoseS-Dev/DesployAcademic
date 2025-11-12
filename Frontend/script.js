/* ===== DATOS ===== */
const videos = [
  {
    id: 1,
    titulo: "Fundamentos de JavaScript",
    videoUrl: "https://www.youtube.com/embed/as9N6_b732I",
    descripcion: "Aprende los conceptos básicos de JavaScript moderno",
    duracion: "8 min",
  },
  {
    id: 3,
    titulo: "SQL para Profesionales",
    videoUrl: "https://www.youtube.com/embed/MNXuG23HH_w",
    descripcion: "Optimización y consultas avanzadas en bases de datos",
    duracion: "15 min",
  },
  {
    id: 4,
    titulo: "Vue.js Framework Completo",
    videoUrl: "https://www.youtube.com/embed/YK4aXQeKjNs",
    descripcion: "Desarrollo frontend progresivo con Vue.js 3",
    duracion: "10 min",
  },
]

const cursos = [
  {
    id: 1,
    titulo: "JavaScript Fundamentos",
    categoria: "Frontend",
    nivel: "Básico",
    estudiantes: 8420,
    duracion: "32h",
    calificacion: 4.9,
    precio: "Incluido",
    descripcion: "Aprende JavaScript moderno desde cero",
    imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
  },
  {
    id: 2,
    titulo: "React Intermedio",
    categoria: "Frontend",
    nivel: "Intermedio",
    estudiantes: 6210,
    duracion: "48h",
    calificacion: 4.9,
    precio: "Incluido",
    descripcion: "Hooks, Context y patrones avanzados",
    imagen: "https://images.unsplash.com/photo-1633356122544-f134324ef6cb?w=500&h=300&fit=crop",
  },
  {
    id: 3,
    titulo: "SQL Profesional",
    categoria: "Backend",
    nivel: "Intermedio",
    estudiantes: 5890,
    duracion: "40h",
    calificacion: 4.8,
    precio: "Incluido",
    descripcion: "Bases de datos relacionales avanzadas",
    imagen: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
  },
  {
    id: 4,
    titulo: "Node.js Full Stack",
    categoria: "Backend",
    nivel: "Avanzado",
    estudiantes: 4950,
    duracion: "56h",
    calificacion: 4.9,
    precio: "Incluido",
    descripcion: "APIs escalables y aplicaciones grandes",
    imagen: "https://images.unsplash.com/photo-1627873649417-af36141a4016?w=500&h=300&fit=crop",
  },
  {
    id: 5,
    titulo: "Vue.js Profesional",
    categoria: "Frontend",
    nivel: "Intermedio",
    estudiantes: 3620,
    duracion: "44h",
    calificacion: 4.8,
    precio: "Incluido",
    descripcion: "Framework progresivo completo",
    imagen: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
  },
  {
    id: 6,
    titulo: "Docker & Deployment",
    categoria: "DevOps",
    nivel: "Avanzado",
    estudiantes: 3240,
    duracion: "28h",
    calificacion: 4.9,
    precio: "Incluido",
    descripcion: "Containerización y deployes en producción",
    imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
  },
]

const profesores = [
  {
    id: 1,
    nombre: "Carlos García",
    rol: "Fullstack Developer",
    bio: "10+ años en desarrollo web, experto en React y Node.js. Ha liderado equipos en startups y empresas Fortune 500.",
    estudiantes: "8.5k+",
    skills: ["React", "Node.js", "JavaScript"],
  },
  {
    id: 2,
    nombre: "María López",
    rol: "Senior Database Engineer",
    bio: "Diseñadora de bases de datos con especialidad en optimización. Experta en arquitecturas empresariales.",
    estudiantes: "6.2k+",
    skills: ["SQL", "PostgreSQL", "MongoDB"],
  },
  {
    id: 3,
    nombre: "Juan Rodríguez",
    rol: "DevOps & Cloud Architect",
    bio: "Especialista en deploy, containerización y CI/CD. Certificado en AWS y Kubernetes.",
    estudiantes: "5.1k+",
    skills: ["Docker", "Kubernetes", "AWS"],
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    rol: "Frontend Architect",
    bio: "Lideresa en arquitectura frontend y UX/UI. Mentora de desarrolladores junior y senior.",
    estudiantes: "4.8k+",
    skills: ["Vue.js", "TypeScript", "Tailwind"],
  },
]

const articulos = [
  {
    id: 1,
    titulo: "10 Consejos para Optimizar tu Código React",
    categoria: "React",
    autor: "Carlos García",
    fecha: "18 Nov 2024",
    vista: "5 min",
    vistas: "2.3k",
    excerpt: "Mejora significativamente el rendimiento de tus aplicaciones React con estas prácticas recomendadas...",
  },
  {
    id: 2,
    titulo: "Docker para Principiantes: Guía Completa",
    categoria: "DevOps",
    autor: "Juan Rodríguez",
    fecha: "16 Nov 2024",
    vista: "8 min",
    vistas: "3.1k",
    excerpt: "Aprende a containerizar tus aplicaciones y desplegar de forma segura con Docker en producción...",
  },
  {
    id: 3,
    titulo: "Diseño de Bases de Datos Escalables",
    categoria: "Backend",
    autor: "María López",
    fecha: "14 Nov 2024",
    vista: "7 min",
    vistas: "1.8k",
    excerpt: "Estrategias y patrones para crear esquemas de bases de datos que crezcan con tu negocio...",
  },
]

const planes = [
  {
    nombre: "Gratuito",
    precio: "Gratis",
    periodo: "",
    descripcion: "Para explorar y aprender",
    features: ["5 cursos básicos", "Comunidad de estudiantes", "Certificados básicos", "Acceso limitado"],
    highlighted: false,
  },
  {
    nombre: "Profesional",
    precio: "$9.99",
    periodo: "/mes",
    descripcion: "Para desarrolladores en crecimiento",
    features: [
      "50+ cursos completos",
      "Certificados profesionales",
      "Acceso de por vida",
      "Descargas de materiales",
      "Soporte por email",
      "Comunidad premium",
      "Proyectos prácticos",
    ],
    highlighted: true,
    badge: "Más Popular",
  },
  {
    nombre: "Empresarial",
    precio: "$29.99",
    periodo: "/mes",
    descripcion: "Para equipos de desarrollo",
    features: [
      "Todo en Profesional",
      "Cursos exclusivos",
      "Mentorías 1-on-1",
      "Sesiones en vivo",
      "Certificación empresarial",
      "Soporte 24/7 prioritario",
      "Acceso API completo",
    ],
    highlighted: false,
  },
]

// Estado de autenticación
let usuarioActual = null

/* ===== FUNCIONES DE CARRUSEL ===== */
let indiceVideoActual = 0

function cambiarVideo(indice) {
  indiceVideoActual = indice
  actualizarCarrusel()
}

function videoAnterior() {
  indiceVideoActual = (indiceVideoActual - 1 + videos.length) % videos.length
  actualizarCarrusel()
}

function videoSiguiente() {
  indiceVideoActual = (indiceVideoActual + 1) % videos.length
  actualizarCarrusel()
}

function actualizarCarrusel() {
  const video = videos[indiceVideoActual]

  // Actualizar información del video
  document.getElementById("videoTitle").textContent = video.titulo
  document.getElementById("videoDescription").textContent = video.descripcion
  document.getElementById("videoDuration").textContent = video.duracion
  document.getElementById("videoCounter").textContent = indiceVideoActual + 1
  document.getElementById("videoTotal").textContent = videos.length

  // Actualizar puntos indicadores
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === indiceVideoActual)
  })

  // Actualizar botones de video
  document.querySelectorAll(".video-item").forEach((btn, i) => {
    btn.classList.toggle("active", i === indiceVideoActual)
  })

  // Limpiar frame anterior si existe
  const videoFrame = document.getElementById("videoFrame")
  videoFrame.innerHTML = `
        <div class="video-placeholder" onclick="reproducirVideo()">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#0066ff">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span class="video-duration">${video.duracion}</span>
        </div>
    `
}

function reproducirVideo() {
  const video = videos[indiceVideoActual]
  const videoFrame = document.getElementById("videoFrame")
  videoFrame.innerHTML = `
        <iframe
            class="w-full aspect-video bg-black"
            src="${video.videoUrl}?autoplay=1"
            title="${video.titulo}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
            style="width: 100%; height: 100%; border: none;">
        </iframe>
    `
}

/* ===== RENDERIZAR CONTENIDO ===== */
function renderizarCursos() {
  const grid = document.getElementById("coursesGrid")
  grid.innerHTML = cursos
    .map(
      (curso) => `
        <div class="course-card">
            <div class="course-image" style="background: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%); background-image: url('${curso.imagen}'); background-size: cover; background-position: center;">
                <div class="course-play-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
            </div>
            <div class="course-content">
                <div class="course-badges">
                    <span class="badge badge-category">${curso.categoria}</span>
                    <span class="badge badge-level">${curso.nivel}</span>
                </div>
                <h3 class="course-title">${curso.titulo}</h3>
                <p class="course-description">${curso.descripcion}</p>
                <div class="course-stats">
                    <span class="stat-item">👥 ${(curso.estudiantes / 1000).toFixed(1)}k</span>
                    <span class="stat-item">⏱️ ${curso.duracion}</span>
                </div>
                <div class="course-footer">
                    <span class="rating">⭐ ${curso.calificacion}</span>
                    <span class="price">${curso.precio}</span>
                </div>
                <button class="course-button" onclick="accionCurso(${curso.id})" ${!usuarioActual ? "disabled" : ""}>
                    ${usuarioActual ? "Ver curso" : "Suscríbete para ver"}
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderizarProfesores() {
  const grid = document.getElementById("teachersGrid")
  grid.innerHTML = profesores
    .map(
      (profesor) => `
        <div class="teacher-card">
            <div class="teacher-image">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${profesor.nombre}" alt="${profesor.nombre}">
            </div>
            <div class="teacher-content">
                <h3 class="teacher-name">${profesor.nombre}</h3>
                <p class="teacher-role">${profesor.rol}</p>
                <p class="teacher-bio">${profesor.bio}</p>
                <p class="teacher-students">${profesor.estudiantes} estudiantes</p>
                <div class="teacher-skills">
                    ${profesor.skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
                </div>
                <div class="teacher-social">
                    <button class="social-link" title="GitHub">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </button>
                    <button class="social-link" title="LinkedIn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.348c-.009.014-.021.033-.033.05h.033v-.05c.418-.645 1.162-1.571 2.828-1.571 2.065 0 3.613 1.349 3.613 4.25v5.619zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.704 0-.951.77-1.704 1.956-1.704 1.187 0 1.915.753 1.948 1.704 0 .946-.76 1.704-1.989 1.704zm1.582 11.597H3.635V9.861h3.284v10.591zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </button>
                    <button class="social-link" title="Twitter">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 002.856-10.986c-1.475.493-3.031.992-4.61 1.494a4.948 4.948 0 00-8.86 4.5c-4.165-2.383-7.846-4.566-10.548-9.172a4.929 4.929 0 001.525 6.573 4.888 4.888 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.900 9.900 0 010 19.54a13.994 13.994 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderizarBlog() {
  const grid = document.getElementById("blogGrid")
  grid.innerHTML = articulos
    .map(
      (articulo) => `
        <div class="blog-card">
            <div class="blog-image">
                <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop" alt="${articulo.titulo}">
                <span class="blog-category-badge">${articulo.categoria}</span>
            </div>
            <div class="blog-content">
                <h3 class="blog-title">${articulo.titulo}</h3>
                <p class="blog-excerpt">${articulo.excerpt}</p>
                <div class="blog-meta">
                    <span class="blog-meta-item">✍️ ${articulo.autor}</span>
                    <span class="blog-meta-item">📅 ${articulo.fecha}</span>
                    <span class="blog-meta-item">👁️ ${articulo.vistas}</span>
                </div>
                <button class="blog-button" onclick="leerBlog(${articulo.id})">
                    Leer más →
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderizarPlanosprecio() {
  const grid = document.getElementById("pricingGrid")
  grid.innerHTML = planes
    .map(
      (plan, idx) => `
        <div class="pricing-card ${plan.highlighted ? "highlighted" : ""}">
            ${plan.highlighted ? `<div class="pricing-badge">✨ ${plan.badge}</div>` : ""}
            <div class="pricing-content">
                <h3 class="pricing-name">${plan.nombre}</h3>
                <p class="pricing-description">${plan.descripcion}</p>
                <div class="pricing-price">${plan.precio}</div>
                ${plan.periodo ? `<div class="pricing-period">${plan.periodo}</div>` : ""}
                <button class="pricing-cta" onclick="elegirPlan('${plan.nombre}')">
                    ${plan.nombre === "Empresarial" ? "Contactar Ventas" : "Comenzar Ahora"}
                </button>
                <div class="pricing-features">
                    ${plan.features
                      .map(
                        (feature) => `
                        <div class="pricing-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            ${feature}
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

/* ===== FUNCIONES DE MODALES ===== */
function mostrarModal(tipo) {
  const modal = tipo === "login" ? document.getElementById("loginModal") : document.getElementById("signupModal")
  modal.classList.add("active")
}

function cerrarModal(tipo) {
  const modal = tipo === "login" ? document.getElementById("loginModal") : document.getElementById("signupModal")
  modal.classList.remove("active")
}

function handleLogin(event) {
  event.preventDefault()
  const email = document.getElementById("loginEmail").value
  const nombre = email.split("@")[0]

  usuarioActual = { email, nombre, plan: "profesional" }
  actualizarUI()
  cerrarModal("login")

  // Limpiar formulario
  document.getElementById("loginForm").reset()

  alert(`¡Bienvenido ${nombre}! Sesión iniciada correctamente.`)
}

function handleSignup(event) {
  event.preventDefault()
  const nombre = document.getElementById("signupName").value
  const email = document.getElementById("signupEmail").value
  const plan = document.getElementById("signupPlan").value

  usuarioActual = { email, nombre, plan }
  actualizarUI()
  cerrarModal("signup")

  // Limpiar formulario
  document.getElementById("signupForm").reset()

  alert(`¡Registrado exitosamente! Bienvenido a DesployAcademic, ${nombre}.`)
}

function cerrarSesion() {
  usuarioActual = null
  actualizarUI()
  alert("Has cerrado sesión exitosamente.")
}

function actualizarUI() {
  const authButtons = document.getElementById("authButtons")
  const userProfile = document.getElementById("userProfile")

  if (usuarioActual) {
    authButtons.style.display = "none"
    userProfile.style.display = "flex"
    document.getElementById("userName").textContent = usuarioActual.nombre
  } else {
    authButtons.style.display = "flex"
    userProfile.style.display = "none"
  }

  // Actualizar botones de cursos
  renderizarCursos()
}

/* ===== FUNCIONES DE ACCIONES ===== */
function accionCurso(id) {
  if (!usuarioActual) {
    mostrarModal("signup")
  } else {
    alert(`Accediendo al curso ${id}...`)
  }
}

function leerBlog(id) {
  alert(`Leyendo artículo ${id}...`)
}

function elegirPlan(plan) {
  mostrarModal("signup")
}

function toggleMenuMobile() {
  const menu = document.getElementById("menuMobile")
  // Aquí iría la lógica del menú móvil
}

/* ===== INICIALIZACIÓN ===== */
document.addEventListener("DOMContentLoaded", () => {
  // Crear puntos indicadores del carrusel
  const container = document.querySelector(".carousel-dots")
  videos.forEach((_, i) => {
    const dot = document.createElement("button")
    dot.classList.add("dot")
    if (i === 0) dot.classList.add("active")
    dot.onclick = () => cambiarVideo(i)
    container.appendChild(dot)
  })

  // Renderizar contenido
  actualizarCarrusel()
  renderizarCursos()
  renderizarProfesores()
  renderizarBlog()
  renderizarPlanosprecio()

  // Cerrar modales al hacer clic afuera
  document.getElementById("loginModal").addEventListener("click", (e) => {
    if (e.target.id === "loginModal") cerrarModal("login")
  })

  document.getElementById("signupModal").addEventListener("click", (e) => {
    if (e.target.id === "signupModal") cerrarModal("signup")
  })

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    })
  })
})
