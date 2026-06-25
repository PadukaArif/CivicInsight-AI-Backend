import Groq from "groq-sdk"
import { GROQ_API_KEY } from "../../config/groq"
import { GEMINI_API_KEY } from "../../config/gemini"
import { GoogleGenAI } from "@google/genai"


const groq = new Groq({
  apiKey: GROQ_API_KEY || "dummy-groq-key-placeholder"
})

const gemini = new GoogleGenAI({
  apiKey: GEMINI_API_KEY || "dummy-gemini-key-placeholder"
})

const DEFAULT_SYSTEM_PROMPT = "Anda adalah Asisten AI Warga RT/RW di CivicInsight AI. Jawablah selalu dalam Bahasa Indonesia secara ramah, ringkas, dan informatif. Format output Anda dalam bentuk Markdown (gunakan **tebal** untuk penekanan, dan buat link URL dapat diklik secara normal).";

export const chatWithAI = async (message: string, customSystemPrompt?: string) => {
  const systemPrompt = customSystemPrompt || DEFAULT_SYSTEM_PROMPT;
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: message
      }
    ]
  })

  return res.choices[0]?.message?.content ?? "No response"
}

export const chatWithGemini = async (message: string, customSystemPrompt?: string) => {
  if (!message) return "No message provided"
  const systemPrompt = customSystemPrompt || DEFAULT_SYSTEM_PROMPT;

  try {
    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt
      }
    })

    return result.text
  } catch (err) {
    console.error("Gemini 2.5 flash-lite failed, trying gemini-2.0-flash fallback:", err);
    try {
      const result = await gemini.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction: systemPrompt
        }
      })
      return result.text
    } catch (err2) {
      console.error("Gemini fallback failed, falling back to Groq Llama:", err2);
      try {
        return await chatWithAI(message, customSystemPrompt)
      } catch (err3) {
        console.error("Groq fallback also failed:", err3);
        throw err3;
      }
    }
  }
}

export const translateTextToIndonesian = async (text: string): Promise<string> => {
  if (!text) return "";
  const prompt = `Terjemahkan istilah/indikator kesehatan berikut ke Bahasa Indonesia yang baku dan mudah dipahami oleh masyarakat umum. Kembalikan HANYA hasil terjemahannya saja tanpa tanda kutip, tanpa penjelasan, dan tanpa teks tambahan.\n\nIstilah: "${text}"`;
  
  try {
    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "Anda adalah penerjemah istilah medis profesional. Tugas Anda adalah menerjemahkan teks Bahasa Inggris ke Bahasa Indonesia dengan akurat dan ringkas. JANGAN berikan penjelasan atau teks tambahan. Kembalikan HANYA teks terjemahan."
      }
    });
    if (result.text && !result.text.includes("dummy-gemini-key-placeholder") && !result.text.includes("AI error")) {
      return result.text.trim().replace(/^"(.*)"$/, '$1');
    }
  } catch (err) {
    console.error("Gemini translation failed, trying Groq fallback:", err);
    try {
      const res = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Anda adalah penerjemah istilah medis profesional. Tugas Anda adalah menerjemahkan teks Bahasa Inggris ke Bahasa Indonesia dengan akurat dan ringkas. JANGAN berikan penjelasan atau teks tambahan. Kembalikan HANYA teks terjemahan."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });
      const content = res.choices[0]?.message?.content;
      if (content && !content.includes("dummy-groq-key-placeholder")) {
        return content.trim().replace(/^"(.*)"$/, '$1');
      }
    } catch (err2) {
      console.error("Groq translation failed too:", err2);
    }
  }
  return "";
}