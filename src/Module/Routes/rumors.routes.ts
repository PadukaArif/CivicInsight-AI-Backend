import { Elysia, t } from 'elysia'
import { db } from '../../config/database'

export const rumorsRoutes = new Elysia()
  // RUMORS
  .get('/rumors', ({ set }) => {
    try {
      const query = db.prepare(`
        SELECT r.id, r.reporter_id AS reporterId, r.judul, r.deskripsi, r.status, COALESCE(p.full_name, 'Warga Teladan RT 04') AS reporterName
        FROM rumors r
        LEFT JOIN profiles p ON r.reporter_id = p.account_id
      `);
      return { success: true, data: query.all() };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .post('/rumors', ({ body, set }) => {
    try {
      const query = db.prepare(`
        INSERT INTO rumors (reporter_id, judul, deskripsi, status)
        VALUES (?, ?, ?, 'Belum Diverifikasi')
      `);
      const result = query.run(Number(body.reporterId), body.judul, body.deskripsi);
      return { success: true, message: "Kabar angin/isu berhasil dilaporkan untuk diverifikasi", data: { id: result.lastInsertRowid } };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      reporterId: t.Numeric(),
      judul: t.String(),
      deskripsi: t.String()
    })
  })
  .post('/rumors/:id/verify', ({ params, body, set }) => {
    try {
      // 1. Update status rumor
      const updateRumor = db.prepare("UPDATE rumors SET status = 'Diverifikasi' WHERE id = ?");
      updateRumor.run(Number(params.id));

      // 2. Tambah fakta verifikasi
      const insertFact = db.prepare(`
        INSERT INTO facts (rumor_id, judul, penjelasan, status, sumber)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = insertFact.run(
        Number(params.id),
        body.judul,
        body.penjelasan,
        body.status,
        body.sumber || null
      );
      
      return { success: true, message: "Rumor berhasil diverifikasi menjadi fakta resmi", data: { id: result.lastInsertRowid } };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      judul: t.String(),
      penjelasan: t.String(),
      status: t.Union([t.Literal('fakta'), t.Literal('hoaks')]),
      sumber: t.Optional(t.String())
    })
  })

  // FACTS
  .get('/facts', ({ set }) => {
    try {
      const query = db.prepare(`
        SELECT id, rumor_id AS rumorId, judul, penjelasan, status, sumber 
        FROM facts
      `);
      return { success: true, data: query.all() };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .post('/facts', ({ body, set }) => {
    try {
      const query = db.prepare(`
        INSERT INTO facts (judul, penjelasan, status, sumber)
        VALUES (?, ?, ?, ?)
      `);
      const result = query.run(
        body.judul,
        body.penjelasan,
        body.status,
        body.sumber || null
      );
      return { success: true, message: "Klarifikasi fakta resmi berhasil diterbitkan", data: { id: result.lastInsertRowid } };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      judul: t.String(),
      penjelasan: t.String(),
      status: t.Union([t.Literal('fakta'), t.Literal('hoaks')]),
      sumber: t.Optional(t.String())
    })
  })
  .patch('/facts/:id', ({ params, body, set }) => {
    try {
      const query = db.prepare(`
        UPDATE facts 
        SET judul = ?, penjelasan = ?, status = ?, sumber = ?
        WHERE id = ?
      `);
      query.run(body.judul, body.penjelasan, body.status, body.sumber || null, Number(params.id));
      return { success: true, message: "Klarifikasi fakta resmi berhasil diperbarui" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      judul: t.String(),
      penjelasan: t.String(),
      status: t.Union([t.Literal('fakta'), t.Literal('hoaks')]),
      sumber: t.Optional(t.String())
    })
  })
  .delete('/facts/:id', ({ params, set }) => {
    try {
      const query = db.prepare("DELETE FROM facts WHERE id = ?");
      query.run(Number(params.id));
      return { success: true, message: "Fakta resmi berhasil dihapus" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .delete('/rumors/:id', ({ params, set }) => {
    try {
      const query = db.prepare("DELETE FROM rumors WHERE id = ?");
      query.run(Number(params.id));
      return { success: true, message: "Rumor berhasil dihapus" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
