import { Elysia, t } from 'elysia'
import { db } from '../../config/database'

export const householdsRoutes = new Elysia({ prefix: '/households' })
  .get('/', ({ set }) => {
    try {
      const households = db.prepare(`
        SELECT id, kk_no AS kkNo, alamat, kepala_keluarga AS kepalaKeluarga, phone_number AS phoneNumber 
        FROM households
      `).all() as any[];
      
      const members = db.prepare(`
        SELECT id, household_id AS householdId, nama, nik, pekerjaan, hubungan, status_kawin AS statusKawin, pendidikan 
        FROM household_members
      `).all() as any[];

      const result = households.map(h => ({
        ...h,
        members: members.filter(m => m.householdId === h.id)
      }));

      return { success: true, data: result };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .post('/', ({ body, set }) => {
    try {
      const query = db.prepare(`
        INSERT INTO households (kk_no, alamat, kepala_keluarga, phone_number)
        VALUES (?, ?, ?, ?)
      `);
      const result = query.run(body.kkNo, body.alamat, body.kepalaKeluarga, body.phoneNumber || null);
      return { success: true, message: "Kartu Keluarga baru berhasil didaftarkan", data: { id: result.lastInsertRowid } };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      kkNo: t.String(),
      alamat: t.String(),
      kepalaKeluarga: t.String(),
      phoneNumber: t.Optional(t.String())
    })
  })
  .patch('/:id', ({ params, body, set }) => {
    try {
      const query = db.prepare(`
        UPDATE households 
        SET kk_no = ?, alamat = ?, kepala_keluarga = ?, phone_number = ?
        WHERE id = ?
      `);
      query.run(body.kkNo, body.alamat, body.kepalaKeluarga, body.phoneNumber || null, Number(params.id));
      return { success: true, message: "Data Kartu Keluarga berhasil diperbarui" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      kkNo: t.String(),
      alamat: t.String(),
      kepalaKeluarga: t.String(),
      phoneNumber: t.Optional(t.String())
    })
  })
  .delete('/:id', ({ params, set }) => {
    try {
      const query = db.prepare("DELETE FROM households WHERE id = ?");
      query.run(Number(params.id));
      return { success: true, message: "Data Kartu Keluarga berhasil dihapus" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })

  // MEMBERS MANAGEMENT
  .post('/:id/members', ({ params, body, set }) => {
    try {
      // Check if NIK already exists
      const existing = db.prepare("SELECT id FROM household_members WHERE nik = ?").get(body.nik);
      if (existing) {
        set.status = 400;
        return { success: false, message: "NIK sudah terdaftar di anggota keluarga lain" };
      }

      const query = db.prepare(`
        INSERT INTO household_members (household_id, nama, nik, pekerjaan, hubungan, status_kawin, pendidikan)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const result = query.run(
        Number(params.id),
        body.nama,
        body.nik,
        body.pekerjaan,
        body.hubungan,
        body.statusKawin,
        body.pendidikan
      );
      return { success: true, message: "Anggota keluarga baru berhasil didaftarkan", data: { id: result.lastInsertRowid } };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      nama: t.String(),
      nik: t.String(),
      pekerjaan: t.String(),
      hubungan: t.String(),
      statusKawin: t.String(),
      pendidikan: t.String()
    })
  })
  .patch('/:id/members/:memberId', ({ params, body, set }) => {
    try {
      const query = db.prepare(`
        UPDATE household_members 
        SET status_kawin = ?, pendidikan = ?
        WHERE id = ? AND household_id = ?
      `);
      query.run(body.statusKawin, body.pendidikan, Number(params.memberId), Number(params.id));
      return { success: true, message: "Data anggota keluarga berhasil diperbarui" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      statusKawin: t.String(),
      pendidikan: t.String()
    })
  })
  .delete('/:id/members/:memberId', ({ params, set }) => {
    try {
      const query = db.prepare("DELETE FROM household_members WHERE id = ? AND household_id = ?");
      query.run(Number(params.memberId), Number(params.id));
      return { success: true, message: "Anggota keluarga berhasil dihapus" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
