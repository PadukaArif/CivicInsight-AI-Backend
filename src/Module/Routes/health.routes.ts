import { Elysia } from "elysia"
import { HealthController } from "../Controller/health.controller"

export const healthRoutes = new Elysia({prefix: "/health"})
  .get("/medicine", async () => {
    return HealthController.healthSolution()
  })
  .get("/news", async () => {
    return HealthController.globalHealthNews()
  })