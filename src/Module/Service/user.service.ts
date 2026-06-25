import { db } from "../../config/database";
import { UserClient } from "../Clients/user.client";
import type { RegisterInput } from "../global.types";

export class UserService {
  static register = db.transaction((input: RegisterInput) => {
    const existingAccount = UserClient.findAccountByEmail(input.email)
    if (existingAccount) {
      throw new Error("Email sudah terdaftar")
    }

    const existingProfile = UserClient.findProfileByNik(input.nik)
    if (existingProfile) {
      throw new Error("NIK sudah terdaftar")
    }

    // Set default points to 0, status to pending
    const registerData = {
      ...input,
      status: 'pending' as const,
      points: 0
    };

    return UserClient.create(registerData)
  })

  static getProfile(id: number) {
    const user = UserClient.findById(id);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }
    return user;
  }

  static login(body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw new Error("Email dan password harus diisi");
    }

    const account = UserClient.findAccountByEmail(email);
    if (!account) {
      throw new Error("Email atau password salah");
    }

    if (account.password !== password) {
      throw new Error("Email atau password salah");
    }

    const profile = UserClient.findById(account.id);
    if (!profile) {
      throw new Error("Profil akun tidak ditemukan");
    }

    if (profile.status === 'pending') {
      throw new Error("Akun Anda belum disetujui (pending) oleh Admin RT/RW.");
    }

    return {
      id: account.id,
      email: account.email,
      ...profile
    };
  }

  static getPending() {
    return UserClient.findPending();
  }

  static getApproved() {
    return UserClient.findApproved();
  }

  static approve(id: number) {
    return UserClient.approve(id);
  }

  static reject(id: number) {
    return UserClient.reject(id);
  }

  static updatePoints(id: number, points: number) {
    return UserClient.updatePoints(id, points);
  }
}