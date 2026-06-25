import { Elysia, t } from 'elysia'
import { db } from '../../config/database'

export const aduanRoutes = new Elysia({ prefix: '/aduan' })
  .get('/', ({ set }) => {
    try {
      const query = db.prepare(`
        SELECT a.id, a.account_id AS accountId, a.kategori, a.lokasi, a.deskripsi, a.status, a.tanggapan, p.full_name AS reporterName
        FROM aduan a
        JOIN profiles p ON a.account_id = p.account_id
      `);
      return { success: true, data: query.all() };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .get('/user/:userId', ({ params, set }) => {
    try {
      const query = db.prepare(`
        SELECT id, account_id AS accountId, kategori, lokasi, deskripsi, status, tanggapan 
        FROM aduan 
        WHERE account_id = ?
      `);
      return { success: true, data: query.all(Number(params.userId)) };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .post('/', ({ body, set }) => {
    try {
      const query = db.prepare(`
        INSERT INTO aduan (account_id, kategori, lokasi, deskripsi, status)
        VALUES (?, ?, ?, ?, 'Terkirim')
      `);
      const result = query.run(Number(body.accountId), body.kategori, body.lokasi, body.deskripsi);
      return { success: true, message: "Aduan berhasil dikirim", data: { id: result.lastInsertRowid } };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      accountId: t.Numeric(),
      kategori: t.String(),
      lokasi: t.String(),
      deskripsi: t.String()
    })
  })
  .patch('/:id', ({ params, body, set }) => {
    try {
      const query = db.prepare(`
        UPDATE aduan 
        SET status = ?, tanggapan = ?
        WHERE id = ?
      `);
      query.run(body.status, body.tanggapan || null, Number(params.id));
      return { success: true, message: "Status aduan berhasil diperbarui" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      status: t.Union([t.Literal('Terkirim'), t.Literal('Diproses'), t.Literal('Selesai')]),
      tanggapan: t.Optional(t.String())
    })
  })
  .delete('/:id', ({ params, set }) => {
    try {
      const query = db.prepare("DELETE FROM aduan WHERE id = ?");
      query.run(Number(params.id));
      return { success: true, message: "Aduan berhasil dihapus" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
