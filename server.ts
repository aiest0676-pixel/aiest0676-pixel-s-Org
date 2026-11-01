import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const port = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  // AI Assistant endpoint for notes
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { prompt, noteContent, noteTitle } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
      }

      const systemInstruction = `คุณคือผู้ช่วย AI อัจฉริยะสำหรับแอปจดบันทึก Life OS ช่วยตอบคำถาม วิเคราะห์ สรุป หรือให้คำแนะนำเกี่ยวกับเนื้อหาโน้ตของผู้ใช้เป็นภาษาไทยอย่างสุภาพ กระชับ และเป็นประโยชน์`;
      const contextMessage = `หัวข้อโน้ต: "${noteTitle || 'ไม่มีหัวข้อ'}"\nเนื้อหาโน้ต:\n"""\n${noteContent || ''}\n"""\n\nคำถามหรือคำสั่งจากผู้ใช้: ${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contextMessage,
        config: {
          systemInstruction
        }
      });

      res.json({ text: response.text || 'ไม่สามารถสร้างคำตอบได้ในขณะนี้' });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
