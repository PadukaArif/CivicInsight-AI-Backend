import { Elysia, t } from 'elysia'
import { db } from '../../config/database'

export const announcementsRoutes = new Elysia({ prefix: '/announcements' })
  .get('/', ({ set }) => {
    try {
      const query = db.prepare("SELECT id, title, content, category, urgency, created_at AS createdAt FROM announcements ORDER BY id DESC");
      return { success: true, data: query.all() };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .post('/', ({ body, set }) => {
    try {
      const query = db.prepare(`
        INSERT INTO announcements (title, content, category, urgency)
        VALUES (?, ?, ?, ?)
      `);
      const result = query.run(body.title, body.content, body.category, body.urgency);
      return { success: true, message: "Pengumuman baru berhasil diterbitkan", data: { id: result.lastInsertRowid } };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      title: t.String(),
      content: t.String(),
      category: t.Union([t.Literal('Penting'), t.Literal('Umum'), t.Literal('Kegiatan')]),
      urgency: t.Union([t.Literal('high'), t.Literal('normal')])
    })
  })
  .patch('/:id', ({ params, body, set }) => {
    try {
      const query = db.prepare(`
        UPDATE announcements 
        SET title = ?, content = ?, category = ?, urgency = ?
        WHERE id = ?
      `);
      query.run(body.title, body.content, body.category, body.urgency, Number(params.id));
      return { success: true, message: "Pengumuman berhasil diperbarui" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      title: t.String(),
      content: t.String(),
      category: t.Union([t.Literal('Penting'), t.Literal('Umum'), t.Literal('Kegiatan')]),
      urgency: t.Union([t.Literal('high'), t.Literal('normal')])
    })
  })
  .delete('/:id', ({ params, set }) => {
    try {
      const query = db.prepare("DELETE FROM announcements WHERE id = ?");
      query.run(Number(params.id));
      return { success: true, message: "Pengumuman berhasil dihapus" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
