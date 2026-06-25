import cors from "@elysia/cors"
import { Elysia } from "elysia"
import { db } from "./config/database"
import "./database/init"
import newsRoutes from "./Module/Routes/news.routes"
import { logger } from "@bogeychan/elysia-logger"
import { rateLimit } from "elysia-rate-limit"
import { swaggerPlugin } from "./plugins/swagger"
import { userRoutes } from "./Module/Routes/user.routes"
import { aiRoute } from "./Module/Routes/ai.routes"
import { healthRoutes } from "./Module/Routes/health.routes"
import { aduanRoutes } from "./Module/Routes/aduan.routes"
import { announcementsRoutes } from "./Module/Routes/announcements.routes"
import { householdsRoutes } from "./Module/Routes/households.routes"
import { kasRoutes } from "./Module/Routes/kas.routes"
import { quizRoutes } from "./Module/Routes/quiz.routes"
import { rumorsRoutes } from "./Module/Routes/rumors.routes"
import { contactsRoutes } from "./Module/Routes/contacts.routes"
import { pollRoutes } from "./Module/Routes/poll.routes"

const app = new Elysia()
  .use(cors())
  .use(rateLimit({
    duration: 60000,
    max: 100
  }))
  .use(logger())
  .use(swaggerPlugin)
  .use(aiRoute)
  .use(userRoutes)
  .use(newsRoutes)
  .use(healthRoutes)
  .use(aduanRoutes)
  .use(announcementsRoutes)
  .use(householdsRoutes)
  .use(kasRoutes)
  .use(quizRoutes)
  .use(rumorsRoutes)
  .use(contactsRoutes)
  .use(pollRoutes)
  .listen(4000, () => {
    console.log("Server is running on port 4000")
  })

  