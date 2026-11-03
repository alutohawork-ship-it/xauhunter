// npm install express cors axios dotenv
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// API Key disimpan di file .env (TIDAK di kode frontend)
const AI_API_KEY = process.env.AI_API_KEY;
const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';

app.post('/api/analyze-xauusd', async (req, res) => {
    const { currentPrice } = req.body;

    if (!currentPrice) {
        return res.status(400).json({ error: 'Harga saat ini diperlukan' });
    }

    try {
        // Panggil API AI (contoh format OpenAI-compatible)
        const response = await axios.post(AI_API_URL, {
            model: 'gpt-4o-mini', // atau 'deepseek-chat' jika pakai DeepSeek
            messages: [
                {
                    role: 'system',
                    content: 'Anda adalah analis trading XAUUSD profesional. Berikan sinyal BUY/SELL/HOLD, level entry, stop-loss, dan take-profit berdasarkan data yang diberikan. Jawab dalam Bahasa Indonesia yang jelas dan ringkas.'
                },
                {
                    role: 'user',
                    content: `Harga XAUUSD saat ini adalah $${currentPrice}. Berikan analisis teknikal singkat dan rekomendasi trading.`
                }
            ],
            temperature: 0.3,
            max_tokens: 500
        }, {
            headers: {
                'Authorization': `Bearer ${AI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const analysis = response.data.choices[0].message.content;
        res.json({ analysis });

    } catch (error) {
        console.error('AI API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Gagal mendapatkan analisis dari AI' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend berjalan di http://localhost:${PORT}`);
});
