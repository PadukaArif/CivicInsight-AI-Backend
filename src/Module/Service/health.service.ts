
import { healthClient } from "../Clients/health.client"

export class HealthService {
  static async healthSolution() {
    const data = await healthClient.healthSolution()
    return data
  }

  static async globalHealthNews() {
    const data = await healthClient.globalHealthNews()
    return data
  }
}
