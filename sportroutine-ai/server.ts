import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const SYSTEM_PROMPT = `Você é o SportRoutine AI, um assistente especializado em organização de rotinas e hábitos para praticantes de esportes.
Sua função é ajudar usuários a organizar suas atividades diárias de forma clara, prática e adaptada às informações fornecidas pelo usuário.
Você receberá informações relacionadas ao perfil esportivo do usuário, como:
- esporte praticado;
- nível de experiência;
- objetivo;
- dias disponíveis;
- tempo disponível;
- tarefas;
- hábitos;
- histórico de atividades.

REGRAS DE COMPORTAMENTO:
1. Utilize somente as informações fornecidas no contexto e na solicitação do usuário.
2. Considere somente as informações relevantes para a tarefa solicitada. Não é necessário utilizar todos os dados disponíveis.
3. Respeite o tempo disponível informado pelo usuário ao organizar atividades.
4. Priorize tarefas de acordo com sua prioridade, objetivo e contexto.
5. Não invente informações sobre o usuário.
6. Caso uma informação necessária não esteja disponível, informe que ela não foi fornecida em vez de inventá-la (ou faça perguntas objetivas para completar).
7. As respostas devem ser claras, objetivas e fáceis de transformar em tarefas dentro de uma aplicação.
8. Quando o usuário solicitar uma rotina, organize as atividades em uma sequência lógica.
9. Quando o usuário solicitar uma adaptação de rotina, preserve as informações importantes da rotina original e adapte somente o que for necessário.
10. Explique suas sugestões quando o usuário solicitar uma justificativa.

FORMATO DAS ROTINAS:
Quando solicitado a criar ou detalhar uma rotina, apresente de forma bem estruturada:
- 🎯 **Objetivo da rotina**
- 📋 **Tarefas / Blocos de treino** (com duração estimada de cada tarefa e prioridade: Alta, Média ou Baixa)
- ⏱️ **Duração total** (respeitando rigorosamente o tempo informado pelo usuário)
- 💡 **Dicas práticas de execução ou foco da sessão**

SEGURANÇA E LIMITAÇÕES:
O SportRoutine AI é um assistente de organização e não substitui profissionais de educação física, medicina, fisioterapia ou nutrição.
Não faça diagnósticos médicos. Não prescreva tratamentos. Não faça recomendações médicas personalizadas.
Quando uma solicitação exigir avaliação profissional, informe ao usuário que a orientação de um profissional qualificado é necessária.

OBJETIVO PRINCIPAL:
Ajudar o usuário a manter uma rotina esportiva organizada, consistente e adequada às informações fornecidas, evitando complexidade desnecessária e priorizando ações práticas.`;

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function generateWithFallback(
  ai: GoogleGenAI,
  contents: any,
  systemPrompt: string,
  temperature: number = 0.7
) {
  // Models priority: gemini-3.1-flash-lite (high capacity/availability), gemini-flash-latest, gemini-3.7-flash
  const models = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature,
          },
        });

        return {
          text: response.text || "",
          usageMetadata: response.usageMetadata,
          modelUsed: model,
        };
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt ${attempt + 1} failed:`, err?.message || err);
        // Wait with backoff + jitter before retry
        const delay = (attempt + 1) * 600 + Math.random() * 400;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Falha ao se comunicar com o modelo de IA.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", name: "SportRoutine AI API" });
  });

  // Chat completion endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Mensagens inválidas fornecidas." });
      }

      const ai = getAiClient();

      // Transform messages into contents format for Gemini
      const formattedContents = messages.map((m: { role: string; content: string }) => {
        return {
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        };
      });

      const result = await generateWithFallback(ai, formattedContents, SYSTEM_PROMPT, 0.7);

      return res.json({
        reply: result.text || "Rotina processada com sucesso.",
        usageMetadata: result.usageMetadata,
        model: result.modelUsed,
      });
    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      const errorMessage = err?.message || "Erro ao processar sua mensagem. Por favor, tente novamente.";
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Structured routine generation endpoint
  app.post("/api/generate-routine", async (req, res) => {
    try {
      const { sport, level, objective, days, timePerDay, notes } = req.body;
      const ai = getAiClient();

      const prompt = `Crie uma rotina esportiva organizada com base nestas informações:
- Esporte: ${sport || "Geral / Poliesportivo"}
- Nível de experiência: ${level || "Iniciante"}
- Objetivo: ${objective || "Condicionamento e consistência"}
- Dias disponíveis: ${Array.isArray(days) ? days.join(", ") : days || "3 dias na semana"}
- Tempo disponível por dia: ${timePerDay || "45 minutos"}
${notes ? `- Observações / Restrições: ${notes}` : ""}

Monte um plano prático, com divisão lógica das tarefas, estimativa de tempo exata para respeitar o limite, e prioridades claras.`;

      const result = await generateWithFallback(ai, prompt, SYSTEM_PROMPT, 0.7);

      return res.json({
        reply: result.text,
        usageMetadata: result.usageMetadata,
        model: result.modelUsed,
      });
    } catch (err: any) {
      console.error("Error in /api/generate-routine:", err);
      return res.status(500).json({ error: err?.message || "Falha ao gerar rotina estruturada." });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SportRoutine AI server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
