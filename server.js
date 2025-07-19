const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Configura onde os vídeos vão ser salvos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Serve os arquivos do site
// Isso permite que você acesse arquivos como /seu_arquivo.css ou /seu_arquivo.js
app.use(express.static('.')); // Serve arquivos estáticos da pasta raiz do seu projeto

// Rota que serve o arquivo index.html na raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'projeto amostra.html'));
});

// Rota que recebe o upload
app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).send('Nenhum arquivo enviado.');
  res.send(`Arquivo "${req.file.originalname}" salvo com sucesso!`);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});