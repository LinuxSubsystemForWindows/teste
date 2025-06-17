require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const TELEGRAM_API = `https://api.telegram.org/bot7020765117:AAFIn4F1NCnpcV6zGw26ODYHsAfxMLlRkSI`;

// Configuração do multer (memória, sem salvar no disco)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 30 * 1024 * 1024 } // Limite de 50MB
});

app.get('/', (req, res) => {
    res.send('Telegram File Proxy API is running.');
});

// Enviar arquivo para Telegram
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const chat_id = "589376542";
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;

        const formData = new FormData();
        formData.append('chat_id', chat_id);
        formData.append('document', fileBuffer, fileName);

        const telegramResp = await axios.post(
            `${TELEGRAM_API}/sendDocument`,
            formData,
            { headers: formData.getHeaders() }
        );

        // Retorna o file_id gerado pelo Telegram
        const file_id = telegramResp.data.result.document?.file_id;

        res.json({ message: 'File sent to Telegram!', file_id });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Upload failed.' });
    }
});

// Download / proxy para arquivos
app.get('/file/:file_id', async (req, res) => {
    const { file_id } = req.params;

    try {
        const resp = await axios.get(`${TELEGRAM_API}/getFile`, {
            params: { file_id }
        });

        const filePath = resp.data.result?.file_path;

        if (!filePath) {
            return res.status(404).json({ error: 'File not found on Telegram.' });
        }

        const telegramFileURL = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;

        res.redirect(telegramFileURL);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
