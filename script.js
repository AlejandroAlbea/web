document.addEventListener("DOMContentLoaded", () => {
  
  // --- TEMA (DARK/LIGHT) ---
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const currentTheme = localStorage.getItem("theme") || "dark";

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
    localStorage.setItem("theme", theme);
  };

  applyTheme(currentTheme);

  themeToggle.addEventListener("click", () => {
    const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });

  // --- NAVEGACIÓN MÓVIL ---
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // --- CURSOR PERSONALIZADO (Interpolación suave) ---
  const cursor = document.getElementById("cursorBall");
  let mouseX = 0, mouseY = 0;
  let ballX = 0, ballY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    ballX += (mouseX - ballX) * 0.15;
    ballY += (mouseY - ballY) * 0.15;
    cursor.style.transform = `translate(${ballX}px, ${ballY}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Efecto Hover en elementos interactivos
  const interactive = "a, button, .chip, input";
  document.querySelectorAll(interactive).forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });

  // --- GESTIÓN DE PROYECTOS ---
  const projects = [
    {
      title: "CadistasOnTour",
      desc: "Plataforma de gestión de reservas para peñas cadistas. Incluye sistema de plazas y validación de usuarios.",
      tags: ["React", "Node.js", "MongoDB"],
      live: "#",
      repo: "https://github.com/AlejandroAlbea/cadistas-on-tour-v3"
    },
    {
        title: "Home Lab Monitor",
        desc: "Monitorización en tiempo real de servicios mediante Netdata y dashboards personalizados.",
        tags: ["Linux", "Netdata", "Docker"],
        live: "#",
        repo: "#"
    }
  ];

  const grid = document.getElementById("projectsGrid");
  const template = document.getElementById("projectCardTemplate");

  const renderProjects = (filterText = "") => {
    grid.innerHTML = "";
    const filtered = projects.filter(p => 
      p.title.toLowerCase().includes(filterText) || 
      p.tags.some(t => t.toLowerCase().includes(filterText))
    );

    filtered.forEach(p => {
      const clone = template.content.cloneNode(true);
      clone.querySelector(".project-title").textContent = p.title;
      clone.querySelector(".project-desc").textContent = p.desc;
      
      const tagsContainer = clone.querySelector(".tags");
      p.tags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "chip";
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });

      clone.querySelector('[data-role="live"]').href = p.live;
      clone.querySelector('[data-role="repo"]').href = p.repo;
      grid.appendChild(clone);
    });
  };

  renderProjects();

  document.getElementById("projectSearch").addEventListener("input", (e) => {
    renderProjects(e.target.value.toLowerCase());
  });

  // --- HERRAMIENTA DE SEGURIDAD ---
  const securityBtn = document.getElementById('checkSecurityBtn');
  const output = document.getElementById('securityOutput');

  securityBtn.addEventListener('click', () => {
    output.textContent = "🔍 Analizando paquetes de red...";
    
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const msg = `
[REPORTE DE CONEXIÓN]
----------------------------------
📡 IP PÚBLICA:  ${data.ip}
📍 UBICACIÓN:   ${data.city}, ${data.country_name}
🏢 ISP:         ${data.org}
----------------------------------
⚠️ NOTA PROFESIONAL:
Estos datos son visibles para cualquier servidor. 
Usa VPN y cifrado de extremo a extremo para mitigar riesgos.
        `;
        output.textContent = msg;
      })
      .catch(() => {
        output.textContent = "❌ Error al recuperar datos. Probablemente un bloqueador de anuncios está activo.";
      });
  });
});