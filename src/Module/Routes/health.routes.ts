import { Elysia } from "elysia"
import { HealthController } from "../Controller/health.controller"

export const healthRoutes = new Elysia({prefix: "/health"})
  .get("/medicine", HealthController.healthSolution)
  .get("/news", HealthController.globalHealthNews)