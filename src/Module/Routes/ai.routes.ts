import { Elysia, t } from "elysia"
import { aiController } from "../Controller/ai.controller"

export const aiRoute = new Elysia({ prefix: "/ai" })
  .post("/chat", aiController.chat, {
    body: t.Object({
      message: t.String(),
      provider: t.Optional(t.String())
    })
  })