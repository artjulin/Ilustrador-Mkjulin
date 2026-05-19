:root {
  --bg: #0f0f0f;
  --accent: #00ff9d;
  --text: #ddd;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  color: var(--accent);
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-links a {
  color: var(--text);
  text-decoration: none;
  margin-left: 35px;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--accent);
}

.hamburger {
  display: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--text);
}

/* Hero */
.hero {
  height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), 
              url('https://via.placeholder.com/1920x1080/111/00ff9d?text=HERO+CONCEPT') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content h1 {
  font-size: 5.5rem;
  margin-bottom: 10px;
}

.hero-content p {
  font-size: 2rem;
  color: var(--accent);
  margin-bottom: 30px;
}

.btn {
  display: inline-block;
  background: var(--accent);
  color: #000;
  padding: 16px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.btn:hover {
  transform: scale(1.05);
  background: #00cc7a;
}

/* Sections */
.section {
  padding: 120px 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.bg-dark {
  background: #1a1a1a;
}

h2 {
  font-size: 3.2rem;
  text-align: center;
  margin-bottom: 70px;
  color: var(--accent);
}

.about-text {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  font-size: 1.25rem;
}

/* Projects */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 30px;
}

.project-card {
  background: #111;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s;
}

.project-card:hover {
  transform: translateY(-15px);
  box-shadow: 0 25px 50px rgba(0, 255, 157, 0.15);
}

.project-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.project-info {
  padding: 25px;
}

.project-info h3 {
  color: var(--accent);
  margin-bottom: 8px;
}

/* Processo */
.process-steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.step {
  background: #1a1a1a;
  padding: 20px 30px;
  border-radius: 50px;
  font-weight: 500;
  text-align: center;
}

/* Footer */
footer {
  text-align: center;
  padding: 60px 20px;
  background: #0a0a0a;
}

/* Responsivo */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #0f0f0f;
    flex-direction: column;
    padding: 20px 0;
  }
  
  .nav-links.active {
    display: flex;
  }
  
  .nav-links a {
    margin: 12px 20px;
  }
  
  .hamburger {
    display: block;
  }
  
  .hero-content h1 {
    font-size: 3.8rem;
  }
}
