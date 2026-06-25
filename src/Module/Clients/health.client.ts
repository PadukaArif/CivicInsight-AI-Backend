// For healthy?

export class healthClient {
  static async healthSolution() {
    try {
      const res = await fetch("https://ghoapi.azureedge.net/api/Dimension")
      if (res.ok) {
        return await res.json()
      }
    } catch (e) {
      console.error("GHO Dimension API failed, using fallback:", e);
    }
    return {
      value: [
        { DimensionCode: "COUNTRY", DimensionName: "Negara" },
        { DimensionCode: "REGION", DimensionName: "Wilayah" },
        { DimensionCode: "YEAR", DimensionName: "Tahun" },
        { DimensionCode: "SEX", DimensionName: "Jenis Kelamin" }
      ]
    };
  }

  static async globalHealthNews() {
    try {
      const res = await fetch("https://ghoapi.azureedge.net/api/Indicator")
      if (res.ok) {
        return await res.json()
      }
    } catch (e) {
      console.error("GHO Indicator API failed, using fallback:", e);
    }
    return {
      value: [
        { IndicatorCode: "HEALTH_01", IndicatorName: "Waspada Demam Berdarah Dengue (DBD) di Pemukiman Padat" },
        { IndicatorCode: "HEALTH_02", IndicatorName: "Program Vaksinasi Polio dan Campak Anak Nasional" },
        { IndicatorCode: "HEALTH_03", IndicatorName: "Pemberantasan Sarang Nyamuk (PSN) dengan program 3M Plus" },
        { IndicatorCode: "HEALTH_04", IndicatorName: "Layanan Hotline Konseling Kesehatan Mental 119 Ext 8" },
        { IndicatorCode: "WHOSIS_000001", IndicatorName: "Life expectancy at birth (years)" },
        { IndicatorCode: "MDG_0000000001", IndicatorName: "Infant mortality rate (per 1000 live births)" },
        { IndicatorCode: "WHOSIS_000003", IndicatorName: "Age-standardized suicide rates (per 100 000 population)" }
      ]
    };
  }
}