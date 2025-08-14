document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // Navegación
  // -----------------------------
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => navLinks.classList.remove("show"));
    });
  }
  
  // -----------------------------
  // Tema oscuro claro
  // -----------------------------
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const setTheme = (mode) => {
    root.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
    themeIcon.textContent = mode === "dark" ? "🌙" : "☀️";
  };
  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme || "dark");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  // -----------------------------
  // Cursor personalizado bola
  // -----------------------------
  const cursor = document.getElementById("cursorBall");
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  const render = () => {
    currentX = lerp(currentX, targetX, 0.2);
    currentY = lerp(currentY, targetY, 0.2);
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
    requestAnimationFrame(render);
  };
  render();

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  const hoverables = ["a", "button", "input", "textarea", ".btn"];
  document.querySelectorAll(hoverables.join(",")).forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });

  // -----------------------------
  // Datos de proyectos
  // -----------------------------
  const projects = [
    {
      title: "CadistasOnTour",
      desc: "Formulario para realizar reservas de plaza de autobus para viajes organizados por peñas cadistas.",
      tags: ["React", "JavaScript", "Node.js"],
      live: "https://private-user-images.githubusercontent.com/91369659/477456459-34906959-710f-49a4-8cfd-1604a33e1efb.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTUwNzY0OTMsIm5iZiI6MTc1NTA3NjE5MywicGF0aCI6Ii85MTM2OTY1OS80Nzc0NTY0NTktMzQ5MDY5NTktNzEwZi00OWE0LThjZmQtMTYwNGEzM2UxZWZiLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA4MTMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwODEzVDA5MDk1M1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTgzMWY3NTNhODQyYWIyNzBkMDVjYjE3YmJmODM2MmJkM2U5Yjc1MTQxMjRlYTQxY2ZlZDBiOWJjMGI2NjE2YzQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.rCE8AA4mJxxTBQ4nrPim4WvapGk-olSsel_VnkloSdQ",
      repo: "https://github.com/AlejandroAlbea/cadistas-on-tour-v3"
    }
  ];

  // Renderizado de proyectos
  const grid = document.getElementById("projectsGrid");
  const tpl = document.getElementById("projectCardTemplate");
  const renderProjects = (list) => {
    grid.innerHTML = "";
    list.forEach(p => {
      const node = tpl.content.cloneNode(true);
      node.querySelector(".project-title").textContent = p.title;
      node.querySelector(".project-desc").textContent = p.desc;
      const tagsEl = node.querySelector(".tags");
      p.tags.forEach(t => {
        const span = document.createElement("span");
        span.className = "chip";
        span.textContent = t;
        tagsEl.appendChild(span);
      });
      node.querySelector('[data-role="live"]').href = p.live || "#";
      node.querySelector('[data-role="repo"]').href = p.repo || "#";
      grid.appendChild(node);
    });
  };
  renderProjects(projects);

  // Búsqueda de proyectos
  const search = document.getElementById("projectSearch");
  if (search) {
    search.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q)
      );
      renderProjects(filtered);
    });
  }

  // -----------------------------
  // Simulación de escaneo
  // -----------------------------
  const scanForm = document.getElementById("scanForm");
  const scanTarget = document.getElementById("scanTarget");
  const scanOutput = document.getElementById("scanOutput");

  if (scanForm) {
    scanForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const target = (scanTarget.value || "").trim();
      if (!target) {
        scanOutput.textContent = "Introduce un objetivo válido.";
        return;
      }
      scanOutput.textContent = "Simulando...";
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target }),
        });
        const data = await res.json();
        if (!data.ok) {
          scanOutput.textContent = data.error || "No se pudo simular.";
          return;
        }
        scanOutput.textContent = data.result;
      } catch (err) {
        scanOutput.textContent = "Error de red. Inténtalo de nuevo.";
      }
    });
  }
});

document.getElementById('checkSecurityBtn').addEventListener('click', () => {
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      const ip = data.ip;
      const ciudad = data.city;
      const region = data.region;
      const pais = data.country_name;
      const proveedor = data.org || "No disponible";

      const mensaje = `
📡 IP Pública: ${ip}
📍 Ubicación Aproximada: ${ciudad}, ${region}, ${pais}
🏢 Proveedor de Internet: ${proveedor}

⚠️ Concienciación:
Si yo puedo ver esto en segundos, imagina lo que un atacante podría obtener con técnicas avanzadas.
Protégete usando una VPN confiable, manteniendo tu sistema actualizado y evitando redes Wi-Fi públicas sin cifrado.
      `;
      document.getElementById('securityOutput').textContent = mensaje;
    })
    .catch(err => {
      document.getElementById('securityOutput').textContent = "Error obteniendo datos: " + err;
    });
});
