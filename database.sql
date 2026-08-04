CREATE DATABASE ilustrapro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ilustrapro;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(20),
    role VARCHAR(20) DEFAULT 'cliente',
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    servico VARCHAR(100),
    descricao TEXT,
    data_preferencial DATE,
    pagamento VARCHAR(50),
    valor DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'Pendente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    ativo TINYINT DEFAULT 1
);

INSERT INTO users (username, password, nome, role) 
VALUES ('admin', '1234', 'Mkjulin', 'admin');

INSERT INTO servicos (nome, descricao, preco) VALUES
('Chibi / Cartoon', 'Ideal para fotos de perfil e presentes fofos', 50),
('Anime Full Body', 'Ilustração completa do corpo', 120),
('Concept Art', 'Arte conceitual detalhada', 200),
('Ilustração Infantil', 'Estilo fofo para crianças', 50),
('Capa de Livro / Thumbnail', 'Capa profissional ou thumbnail', 150);
