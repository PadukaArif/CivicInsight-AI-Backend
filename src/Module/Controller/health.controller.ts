
import { HealthService } from "../Service/health.service"

export class HealthController {
  static async healthSolution() {
    const data = await HealthService.healthSolution()
    return data
  }

  static async globalHealthNews({ query }: { query: { q?: string } }) {
    const data = await HealthService.globalHealthNews(query.q)
    return data
  }
}