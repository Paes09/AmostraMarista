// Importa os módulos necessários
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Importa o módulo 'fs' para manipulação de arquivos/pastas

const app = express();
const PORT = process.env.PORT || 3000; // Usa a porta do ambiente (Render) ou 3000 localmente

// Define o caminho para a pasta de uploads
const uploadDir = path.join(__dirname, 'uploads');

// --- Lógica para criar a pasta 'uploads/' se ela não existir ---
// Isso é crucial para que o servidor possa salvar os vídeos
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // Cria a pasta de forma síncrona
    console.log('Pasta "uploads/" criada com sucesso no servidor.'); // Mensagem para os logs do Render
}

// Configura o armazenamento para o Multer
const storage = multer.diskStorage({
    // Define o destino dos arquivos como a pasta 'uploads/'
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Usa a variável 'uploadDir' que garante que a pasta existe
    },
    // Define o nome do arquivo (timestamp + extensão original)
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Inicializa o Multer com a configuração de armazenamento
const upload = multer({ storage: storage });

// Serve os arquivos estáticos do site a partir da raiz do projeto
// Isso permite que o navegador carregue seu 'projeto amostra.html', CSS, JS, etc.
app.use(express.static('.'));

// Rota GET para a raiz ("/")
// Serve o arquivo 'projeto amostra.html' quando alguém acessa o URL base do site
app.get('/', (req, res) => {
    // Certifique-se de que o nome do arquivo HTML está correto aqui
    res.sendFile(path.join(__dirname, 'projeto amostra.html'));
});

// Rota POST para receber o upload de vídeo
// 'upload.single('video')' espera um campo de formulário chamado 'video'
app.post('/upload', upload.single('video'), (req, res) => {
    // Verifica se um arquivo foi realmente enviado
    if (!req.file) {
        console.log('Nenhum arquivo de vídeo foi enviado.');
        return res.status(400).send('Nenhum arquivo de vídeo foi enviado.');
    }
    // Se o arquivo foi recebido, envia uma mensagem de sucesso
    console.log(`Arquivo "${req.file.originalname}" salvo em ${req.file.path}`);
    res.send(`Arquivo "${req.file.originalname}" salvo com sucesso!`);
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Pressione Ctrl+C para parar o servidor.');
});
