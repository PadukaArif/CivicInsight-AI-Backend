// Mengambil data API dari Berita Indonesia

export class BeritaClient {
  static async cnnNews() {
    const res = await fetch("https://berita-indo-api-next.vercel.app/api/cnn-news")
    const data = await res.json()
    return data
  }

  static async tempoNews() {
    const res = await fetch("https://berita-indo-api-next.vercel.app/api/tempo-news")
    const data = await res.json()
    return data
  }

  static async jakiReports() {
    return {
      success: true,
      data: [
        {
          id: "JK-10293",
          kategori: "Jalan Rusak",
          lokasi: "Jl. Jend. Sudirman Kav 21, Jakarta Selatan",
          deskripsi: "Lubang jalan cukup dalam berpotensi membahayakan pengendara motor.",
          status: "Diproses"
        },
        {
          id: "JK-10294",
          kategori: "Sampah Liar",
          lokasi: "Karet Semanggi, Jakarta Selatan",
          deskripsi: "Tumpukan sampah liar menumpuk di trotoar dekat halte.",
          status: "Selesai"
        },
        {
          id: "JK-10295",
          kategori: "Banjir/Genangan",
          lokasi: "Kemang Raya No. 4, Jakarta Selatan",
          deskripsi: "Genangan air setinggi 30cm pasca hujan lebat mengganggu lalu lintas.",
          status: "Terkirim"
        }
      ]
    };
  }

  static async bansosData() {
    return {
      success: true,
      data: [
        {
          nama: "Rayyan Irfansya",
          nik: "3276010101010001",
          wilayah: "DKI Jakarta, Jakarta Selatan, Kebayoran Baru",
          bpnt: "Penerima Aktif (Tahap 3 - Sembako)",
          pkh: "Penerima Aktif (Komponen Pendidikan SMA)",
          pbi_jk: "Penerima Aktif (KIS Kemenkes)"
        },
        {
          nama: "Wulan Lestari",
          nik: "3276010101010002",
          wilayah: "DKI Jakarta, Jakarta Selatan, Cilandak",
          bpnt: "Bukan Penerima",
          pkh: "Penerima Aktif (Komponen Lansia)",
          pbi_jk: "Penerima Aktif (KIS Kemenkes)"
        },
        {
          nama: "Siti Rahma",
          nik: "3276010101010003",
          wilayah: "DKI Jakarta, Jakarta Selatan, Jagakarsa",
          bpnt: "Penerima Aktif (Tahap 3 - Sembako)",
          pkh: "Bukan Penerima",
          pbi_jk: "Penerima Aktif (KIS Kemenkes)"
        }
      ]
    };
  }
}
