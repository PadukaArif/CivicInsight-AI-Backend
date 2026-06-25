import { db } from "../../config/database";
import type { CreateUserDTO } from "../global.types";

export class UserClient {

  static create(data: CreateUserDTO) {
      // 1. Use standard '?' placeholders for accounts
      const insertQuery = db.prepare(`INSERT INTO accounts (email, password) VALUES (?, ?)`)
      const accountResult = insertQuery.run(data.email, data.password)
  
      const accountId = accountResult.lastInsertRowid as number
  
      // 2. Use standard '?' placeholders for profiles
      const insertProfile = db.prepare(`
        INSERT INTO profiles (account_id, nik, full_name, role, rt, rw, phone_number, is_lansia, status, points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
  
      insertProfile.run(
        accountId,
        data.nik,
        data.fullName,
        data.role || 'warga',
        data.rt || '04',
        data.rw || '02',
        data.phoneNumber ?? null,
        data.isLansia ?? 0,
        data.status || 'pending',
        data.points ?? 0
      )
  
      return { accountId }
  }
  
  static findAccountByEmail(email: string) {
      const query = db.prepare("SELECT id, email, password FROM accounts WHERE email = ?");
      return query.get(email) as any;
    }
  
  static findProfileByNik(nik: string) {
      const query = db.prepare("SELECT id, nik FROM profiles WHERE nik = ?");
      return query.get(nik);
  }

  static findById(id: number) {
    const query = db.prepare(`
      SELECT 
        a.id, 
        a.email, 
        p.nik, 
        p.full_name AS fullName, 
        p.role, 
        p.rt, 
        p.rw, 
        p.phone_number AS phoneNumber, 
        p.is_lansia AS isLansia,
        p.status,
        p.points
      FROM accounts a
      JOIN profiles p ON a.id = p.account_id
      WHERE a.id = ?
    `);
    
    return query.get(id) as any;
  }

  static findPending() {
    const query = db.prepare(`
      SELECT 
        a.id, 
        a.email, 
        p.nik, 
        p.full_name AS fullName, 
        p.role, 
        p.rt, 
        p.rw, 
        p.phone_number AS phoneNumber, 
        p.is_lansia AS isLansia,
        p.status,
        p.points
      FROM accounts a
      JOIN profiles p ON a.id = p.account_id
      WHERE p.status = 'pending'
    `);
    return query.all() as any[];
  }

  static findApproved() {
    const query = db.prepare(`
      SELECT 
        a.id, 
        a.email, 
        p.nik, 
        p.full_name AS fullName, 
        p.role, 
        p.rt, 
        p.rw, 
        p.phone_number AS phoneNumber, 
        p.is_lansia AS isLansia,
        p.status,
        p.points
      FROM accounts a
      JOIN profiles p ON a.id = p.account_id
      WHERE p.status = 'approved'
    `);
    return query.all() as any[];
  }

  static approve(id: number) {
    const query = db.prepare("UPDATE profiles SET status = 'approved' WHERE account_id = ?");
    return query.run(id);
  }

  static reject(id: number) {
    const query = db.prepare("DELETE FROM accounts WHERE id = ?");
    return query.run(id);
  }

  static updatePoints(id: number, points: number) {
    const query = db.prepare("UPDATE profiles SET points = ? WHERE account_id = ?");
    return query.run(points, id);
  }
}