// Menu mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.getAttribute('href') === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
      
      // Fecha menu mobile se aberto
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    }
  });
});

// Exemplo de projetos (você pode adicionar mais)
const projects = [
  {
    title: "Cyber Samurai",
    desc: "Character Design + Environment",
    img: "https://via.placeholder.com/800x600/222/00ff9d?text=CYBER+SAMURAI"
  },
  {
    title: "Ancient Forest Spirit",
    desc: "Fantasy Concept Art",
    img: "https://via.placeholder.com/800x600/222/00ff9d?text=FOREST+SPIRIT"
  },
  {
    title: "Neon Dystopia",
    desc: "Environment Pack",
    img: "https://via.placeholder.com/800x600/222/00ff9d?text=NEON+DYSTOPIA"
  }
];

// Renderiza os projetos
function renderProjects() {
  const container = document.getElementById('projects-grid');
  container.innerHTML = '';

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <img src="${project.img}" alt="${project.title}">
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Inicializa tudo
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
});
