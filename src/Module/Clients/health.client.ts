// For healthy?

export class healthClient {
  static async healthSolution() {
    const res = await fetch("https://ghoapi.azureedge.net/api/Dimension")
    const data = await res.json()
    return data
  }

  static async globalHealthNews() {
    const res = await fetch("https://ghoapi.azureedge.net/api/Indicator")
    const data = await res.json()
    return data
  }
}