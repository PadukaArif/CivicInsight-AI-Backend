import { UserService } from "../Service/user.service";
import type { RegisterInput } from "../global.types";

export class UserController {
  static async register({ body, set }: any) {
    try {
      const result = await UserService.register(body);
      set.status = 201
      return {
        success: true,
        message: "User dan Profile telah berhasil di daftarkan",
        data: result
      }
    } catch (error: any) {
      set.status = 500
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  }

  static getProfile({ params, set }: any) {
    try {
      const id = Number(params.id); 
      const result = UserService.getProfile(id);
  
      return {
        success: true,
        message: "Data user berhasil diambil",
        data: result,
      };
    } catch (error: any) {
      set.status = 404;
      return {
        success: false,
        message: error.message || "Gagal mengambil data user",
      };
    }
  }

  static async login({ body, set }: any) {
    try {
      const result = await UserService.login(body);
      return {
        success: true,
        message: "Login berhasil",
        data: result
      };
    } catch (error: any) {
      set.status = 401;
      return {
        success: false,
        message: error.message || "Login gagal"
      };
    }
  }

  static getPending({ set }: any) {
    try {
      const result = UserService.getPending();
      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        message: error.message || "Gagal mengambil data warga pending"
      };
    }
  }

  static getApproved({ set }: any) {
    try {
      const result = UserService.getApproved();
      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        message: error.message || "Gagal mengambil data warga terdaftar"
      };
    }
  }

  static approve({ params, set }: any) {
    try {
      const id = Number(params.id);
      UserService.approve(id);
      return {
        success: true,
        message: "Pendaftaran warga berhasil disetujui"
      };
    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        message: error.message || "Gagal menyetujui pendaftaran"
      };
    }
  }

  static reject({ params, set }: any) {
    try {
      const id = Number(params.id);
      UserService.reject(id);
      return {
        success: true,
        message: "Pendaftaran warga berhasil ditolak/dihapus"
      };
    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        message: error.message || "Gagal menghapus pendaftaran warga"
      };
    }
  }

  static updatePoints({ params, body, set }: any) {
    try {
      const id = Number(params.id);
      const points = Number(body.points);
      UserService.updatePoints(id, points);
      return {
        success: true,
        message: "Poin warga berhasil diperbarui"
      };
    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        message: error.message || "Gagal memperbarui poin warga"
      };
    }
  }
}