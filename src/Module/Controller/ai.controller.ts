import { chatWithAI, chatWithGemini } from "../Service/ai.services"

export const aiController = {
  chat: async ({ body }: { body: any }) => {
    const { message, provider = "gemini", systemPrompt } = body

    if (!message) {
      return {
        success: false,
        message: "Message is required"
      }
    }

    try {
      let reply
      if (provider === "gemini") {
        reply = await chatWithGemini(message, systemPrompt)
      } else if (provider === "groq") {
        reply = await chatWithAI(message, systemPrompt)
      }

      return {
        success: true,
        reply
      }
    } catch (err) {
      return {
        success: false,
        message: "AI error",
        error: String(err)
      }
    }
  }
}