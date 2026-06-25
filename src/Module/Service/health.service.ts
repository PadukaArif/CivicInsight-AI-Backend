
import { healthClient } from "../Clients/health.client"
import { translateTextToIndonesian } from "./ai.services"

export class HealthService {
  static async healthSolution() {
    const data = await healthClient.healthSolution()
    if (data && Array.isArray(data.value)) {
      data.value = data.value.map((item: any) => ({
        ...item,
        DimensionName: this.translateToIndonesian(item.DimensionName)
      }))
    }
    return data
  }

  static async globalHealthNews(q?: string) {
    console.log("HealthService.globalHealthNews called with q =", q);
    const data = await healthClient.globalHealthNews()
    console.log("GHO API returned data.value array? =", Array.isArray(data?.value), "length =", data?.value?.length);
    if (data && Array.isArray(data.value)) {
      let list = data.value;

      // Filter by query if provided
      if (q) {
        const queryLower = q.toLowerCase().trim();
        list = list.filter((item: any) => 
          (item.IndicatorName && item.IndicatorName.toLowerCase().includes(queryLower)) ||
          (item.IndicatorCode && item.IndicatorCode.toLowerCase().includes(queryLower))
        );
        
        // If we filtered and got nothing, try matching with offline translation terms
        if (list.length === 0) {
          list = data.value.filter((item: any) => {
            const translatedName = this.translateToIndonesian(item.IndicatorName || "");
            return translatedName.toLowerCase().includes(queryLower);
          });
        }
      } else {
        // Return a curated set of the top 15 most relevant health indicators if q is empty
        const curatedCodes = [
          "WHOSIS_000001", // Life expectancy at birth
          "WHOSIS_000002", // Healthy life expectancy at birth
          "MDG_0000000001", // Infant mortality rate
          "MDG_0000000007", // Maternal mortality ratio
          "MDG_0000000011", // Under-five mortality rate
          "MDG_0000000016", // Tuberculosis incidence
          "MDG_0000000021", // Prevalence of tuberculosis
          "WHS3_41", // Neonatal mortality rate
          "WHS3_48", // Measles immunization coverage
          "WHS4_543", // Density of medical doctors
          "WHS4_544", // Density of nursing and midwifery personnel
          "WHS9_86", // Population using safely managed drinking-water services
          "WHS9_87", // Population using safely managed sanitation services
          "NCD_GLUC_01", // Raised fasting blood glucose
          "NCD_HYP_PREV" // Prevalence of raised blood pressure
        ];
        
        const curatedList = list.filter((item: any) => curatedCodes.includes(item.IndicatorCode));
        if (curatedList.length > 0) {
          list = curatedList;
        } else {
          list = list.slice(0, 15);
        }
      }

      // Limit to max 10 to avoid performance bottleneck during translation
      const limitedList = list.slice(0, 10);

      // Translate the list!
      data.value = await this.translateIndicatorList(limitedList);
    }
    return data
  }

  private static async translateIndicatorList(items: any[]) {
    return await Promise.all(
      items.map(async (item: any) => {
        let originalName = item.IndicatorName || "";
        
        // Skip fallback items already in Indonesian
        if (
          originalName.includes("Waspada") || 
          originalName.includes("Program") || 
          originalName.includes("Pemberantasan") || 
          originalName.includes("Layanan")
        ) {
          return item;
        }
        
        // First try dictionary
        let translatedName = this.translateToIndonesian(originalName);
        
        // Then try AI translation if keys are present
        try {
          const hasAIKey = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("dummy-gemini-key-placeholder");
          const hasGroqKey = process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("dummy-groq-key-placeholder");
          
          if (hasAIKey || hasGroqKey) {
            const aiTranslated = await translateTextToIndonesian(originalName);
            if (aiTranslated && aiTranslated.trim().length > 0) {
              translatedName = aiTranslated;
            }
          }
        } catch (e) {
          console.error("AI translation error, using dictionary:", e);
        }
        
        return {
          ...item,
          IndicatorName: translatedName
        };
      })
    );
  }

  private static translateToIndonesian(name: string): string {
    if (!name) return name;
    
    const dictionary: Record<string, string> = {
      "age-standardized mortality rate": "tingkat kematian terstandarisasi usia",
      "ambient air pollution attributable deaths": "kematian akibat polusi udara",
      "life expectancy at birth": "angka harapan hidup saat lahir",
      "healthy life expectancy at birth": "angka harapan hidup sehat saat lahir",
      "maternal mortality": "angka kematian ibu",
      "under-five mortality": "angka kematian balita",
      "neonatal mortality": "angka kematian bayi baru lahir",
      "life expectancy": "angka harapan hidup",
      "healthy life expectancy": "angka harapan hidup sehat",
      "suicide mortality": "angka kematian bunuh diri",
      "road traffic": "kecelakaan lalu lintas",
      "alcohol consumption": "konsumsi alkohol",
      "ambient air pollution": "polusi udara",
      "tuberculosis": "tuberkulosis (TBC)",
      "malaria": "malaria",
      "hiv": "HIV/AIDS",
      "hepatitis": "hepatitis",
      "vaccine": "vaksinasi",
      "immunization": "imunisasi",
      "tobacco": "penggunaan tembakau/rokok",
      "obesity": "obesitas/kegemukan",
      "hypertension": "tekanan darah tinggi (hipertensi)",
      "diabetes": "diabetes/kencing manis",
      "mortality rate": "tingkat kematian",
      "prevalence of": "prevalensi",
      "incidence of": "kejadian kasus",
      "age-standardized": "terstandarisasi usia",
      "per 100 000": "per 100.000 penduduk",
      "per 1000": "per 1.000 kelahiran hidup",
      "medical doctors": "dokter medis",
      "nursing and midwifery personnel": "tenaga keperawatan dan kebidanan",
      "dentists": "dokter gigi",
      "pharmacists": "apoteker/tenaga farmasi",
      "universal health coverage": "jaminan kesehatan semesta (UHC)",
      "clean water": "air bersih",
      "sanitation": "sanitasi",
      "country": "Negara",
      "year": "Tahun",
      "region": "Wilayah",
      "sex": "Jenis Kelamin",
      // Extended Dictionary terms
      "suicide rate": "angka bunuh diri",
      "suicide mortality rate": "tingkat kematian bunuh diri",
      "maternal mortality ratio": "rasio kematian ibu",
      "under-5 mortality rate": "tingkat kematian balita",
      "infant mortality rate": "tingkat kematian bayi",
      "neonatal mortality rate": "tingkat kematian bayi baru lahir",
      "probability of dying": "probabilitas kematian",
      "attributable to": "disebabkan oleh",
      "household air pollution": "polusi udara rumah tangga",
      "unsafe water": "air tidak aman",
      "unsafe sanitation": "sanitasi tidak aman",
      "lack of hygiene": "kurangnya kebersihan/higiene",
      "road traffic injuries": "cedera kecelakaan lalu lintas",
      "homicide": "pembunuhan",
      "poisoning": "keracunan",
      "cardiovascular diseases": "penyakit kardiovaskular/jantung",
      "cancer": "kanker",
      "chronic respiratory diseases": "penyakit pernapasan kronis",
      "noncommunicable diseases": "penyakit tidak menular (PTM)",
      "communicable diseases": "penyakit menular",
      "neglected tropical diseases": "penyakit tropis terabaikan",
      "dengue": "demam berdarah dengue (DBD)",
      "cholera": "kolera",
      "yellow fever": "demam kuning",
      "measles": "campak",
      "polio": "polio",
      "diphtheria": "diphteri",
      "tetanus": "tetanus",
      "pertussis": "pertusis (batuk rejan)",
      "hepatitis b": "hepatitis B",
      "meningitis": "meningitis (radang selaput otak)",
      "pneumonia": "pneumonia (paru-paru basah)",
      "malaria incidence": "kejadian malaria",
      "tuberculosis incidence": "kejadian tuberkulosis (TBC)",
      "hiv incidence": "kejadian HIV",
      "new hiv infections": "infeksi HIV baru",
      "antiretroviral therapy": "terapi antiretroviral (ART)",
      "stunting": "stunting (kekerdilan)",
      "wasting": "wasting (kurus/gizi buruk)",
      "overweight": "kelebihan berat badan",
      "undernourishment": "kurang gizi",
      "raised blood pressure": "tekanan darah tinggi",
      "raised blood glucose": "gula darah tinggi (diabetes)",
      "tobacco use": "penggunaan tembakau/rokok",
      "daily smoking": "merokok harian",
      "alcohol per capita consumption": "konsumsi alkohol per kapita",
      "pure alcohol": "alkohol murni",
      "contraceptive prevalence": "prevalensi kontrasepsi (KB)",
      "unmet need for family planning": "kebutuhan keluarga berencana (KB) yang belum terpenuhi",
      "adolescent birth rate": "angka kelahiran remaja",
      "births attended by skilled health personnel": "persalinan yang dibantu tenaga kesehatan terampil",
      "health worker density": "kepadatan tenaga kesehatan",
      "density of": "kepadatan",
      "hospital beds": "tempat tidur rumah sakit",
      "health expenditure": "pengeluaran kesehatan",
      "out-of-pocket spending": "biaya kesehatan mandiri (out-of-pocket)",
      "gross domestic product": "produk domestik bruto (PDB)",
      "domestic general government health expenditure": "pengeluaran kesehatan pemerintah domestik",
      "mortality caused by": "kematian yang disebabkan oleh",
      "death rate": "angka kematian",
      "probability of": "probabilitas",
      "years of life lost": "tahun masa hidup yang hilang (YLL)",
      "years lived with disability": "tahun hidup dengan disabilitas (YLD)",
      "disability-adjusted life years": "tahun hidup yang disesuaikan dengan disabilitas (DALY)",
      "population": "penduduk/populasi",
      "indicator": "indikator",
      "value": "nilai",
      "male": "Laki-laki",
      "female": "Perempuan",
      "both sexes": "Kedua Jenis Kelamin",
      "total": "Total",
      "average": "Rata-rata",
      "percentage of": "persentase",
      "proportion of": "proporsi"
    };

    let translated = name.toLowerCase();
    
    // Sort keys by length descending to prevent partial match bug (e.g. replacing 'mortality' before 'maternal mortality')
    const sortedEntries = Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length);
    for (const [english, indonesian] of sortedEntries) {
      translated = translated.replace(new RegExp(english, "gi"), indonesian);
    }
    
    return translated.charAt(0).toUpperCase() + translated.slice(1);
  }
}
