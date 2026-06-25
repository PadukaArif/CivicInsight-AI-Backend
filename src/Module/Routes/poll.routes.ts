import { Elysia, t } from 'elysia'
import { db } from '../../config/database'

export const pollRoutes = new Elysia({ prefix: '/poll' })
  .get('/', ({ set }) => {
    try {
      const query = db.prepare("SELECT choice, COUNT(*) as count FROM comfort_votes GROUP BY choice");
      const rows = query.all() as any[];
      
      const data = {
        sangat_nyaman: 0,
        biasa_saja: 0,
        cukup_khawatir: 0
      };
      
      for (const row of rows) {
        if (row.choice in data) {
          data[row.choice as keyof typeof data] = row.count;
        }
      }
      
      return { success: true, data };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .get('/user/:accountId', ({ params, set }) => {
    try {
      const query = db.prepare("SELECT choice FROM comfort_votes WHERE account_id = ?");
      const row = query.get(Number(params.accountId)) as any;
      return { success: true, choice: row ? row.choice : null };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .post('/vote', ({ body, set }) => {
    try {
      // Use INSERT OR REPLACE to allow updating vote or preventing duplicates
      const query = db.prepare("INSERT OR REPLACE INTO comfort_votes (account_id, choice) VALUES (?, ?)");
      query.run(body.accountId, body.choice);
      
      // Get updated counts
      const countQuery = db.prepare("SELECT choice, COUNT(*) as count FROM comfort_votes GROUP BY choice");
      const rows = countQuery.all() as any[];
      const data = {
        sangat_nyaman: 0,
        biasa_saja: 0,
        cukup_khawatir: 0
      };
      for (const row of rows) {
        if (row.choice in data) {
          data[row.choice as keyof typeof data] = row.count;
        }
      }
      
      return { success: true, message: "Pilihan Anda berhasil disimpan", data };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      accountId: t.Number(),
      choice: t.Union([
        t.Literal('sangat_nyaman'),
        t.Literal('biasa_saja'),
        t.Literal('cukup_khawatir')
      ])
    })
  })
