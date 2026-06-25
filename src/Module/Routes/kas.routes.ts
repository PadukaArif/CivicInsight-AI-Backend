import { Elysia, t } from 'elysia'
import { db } from '../../config/database'

export const kasRoutes = new Elysia({ prefix: '/kas' })
  .get('/', ({ set }) => {
    try {
      const query = db.prepare("SELECT id, tanggal, keterangan, jenis, jumlah FROM kas_ledger");
      return { success: true, data: query.all() };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .post('/', ({ body, set }) => {
    try {
      const query = db.prepare(`
        INSERT INTO kas_ledger (tanggal, keterangan, jenis, jumlah)
        VALUES (?, ?, ?, ?)
      `);
      const result = query.run(body.tanggal, body.keterangan, body.jenis, Number(body.jumlah));
      return { success: true, message: "Transaksi kas berhasil dicatat", data: { id: result.lastInsertRowid } };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      tanggal: t.String(),
      keterangan: t.String(),
      jenis: t.Union([t.Literal('pemasukan'), t.Literal('pengeluaran')]),
      jumlah: t.Numeric()
    })
  })
  .patch('/:id', ({ params, body, set }) => {
    try {
      const query = db.prepare(`
        UPDATE kas_ledger 
        SET tanggal = ?, keterangan = ?, jenis = ?, jumlah = ?
        WHERE id = ?
      `);
      query.run(body.tanggal, body.keterangan, body.jenis, Number(body.jumlah), Number(params.id));
      return { success: true, message: "Catatan transaksi kas berhasil diperbarui" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      tanggal: t.String(),
      keterangan: t.String(),
      jenis: t.Union([t.Literal('pemasukan'), t.Literal('pengeluaran')]),
      jumlah: t.Numeric()
    })
  })
  .delete('/:id', ({ params, set }) => {
    try {
      const query = db.prepare("DELETE FROM kas_ledger WHERE id = ?");
      query.run(Number(params.id));
      return { success: true, message: "Catatan transaksi kas berhasil dihapus" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
