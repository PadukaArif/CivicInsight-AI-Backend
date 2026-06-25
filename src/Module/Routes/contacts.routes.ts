import { Elysia, t } from 'elysia'
import { db } from '../../config/database'

export const contactsRoutes = new Elysia({ prefix: '/contacts' })
  .get('/', ({ set }) => {
    try {
      const query = db.prepare("SELECT id, nama, nomor FROM emergency_contacts");
      const result = query.all();
      return { success: true, data: result };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .post('/', ({ body, set }) => {
    try {
      const query = db.prepare("INSERT INTO emergency_contacts (nama, nomor) VALUES (?, ?)");
      const result = query.run(body.nama, body.nomor);
      return {
        success: true,
        message: "Kontak darurat berhasil ditambahkan",
        data: { id: result.lastInsertRowid, nama: body.nama, nomor: body.nomor }
      };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      nama: t.String(),
      nomor: t.String()
    })
  })
  .put('/:id', ({ params, body, set }) => {
    try {
      const query = db.prepare("UPDATE emergency_contacts SET nama = ?, nomor = ? WHERE id = ?");
      const result = query.run(body.nama, body.nomor, Number(params.id));
      if (result.changes === 0) {
        set.status = 404;
        return { success: false, message: "Kontak tidak ditemukan" };
      }
      return { success: true, message: "Kontak darurat berhasil diperbarui" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      nama: t.String(),
      nomor: t.String()
    })
  })
  .delete('/:id', ({ params, set }) => {
    try {
      const query = db.prepare("DELETE FROM emergency_contacts WHERE id = ?");
      const result = query.run(Number(params.id));
      if (result.changes === 0) {
        set.status = 404;
        return { success: false, message: "Kontak tidak ditemukan" };
      }
      return { success: true, message: "Kontak darurat berhasil dihapus" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
