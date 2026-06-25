import { Elysia, t } from 'elysia'
import { UserController } from '../Controller/user.controller'

export const userRoutes = new Elysia({ prefix: '/auth' })
  .post('/register', UserController.register, {
    body: t.Object({
      email: t.String({
        format: 'email',
        error: 'Format email tidak valid',
      }),
      password: t.String({
        minLength: 1,
        error: 'Password tidak boleh kosong',
      }),
      nik: t.String({
        minLength: 16,
        maxLength: 16,
        error: 'NIK harus berjumlah 16 karakter',
      }),
      fullName: t.String({ error: 'Nama lengkap wajib diisi' }),
      role: t.Optional(
        t.Union(
          [t.Literal('warga'), t.Literal('admin_rt'), t.Literal('admin_rw')],
          { error: 'Role harus berupa warga, admin_rt, atau admin_rw' }
        )
      ),
      rt: t.Optional(t.String()),
      rw: t.Optional(t.String()),
      phoneNumber: t.Optional(t.String()),
      isLansia: t.Optional(t.Number()),
    }),
  })
  .post('/login', UserController.login)
  .get('/profile/:id', UserController.getProfile)
  .get('/pending', UserController.getPending)
  .get('/approved', UserController.getApproved)
  .post('/approve/:id', UserController.approve)
  .post('/reject/:id', UserController.reject)
  .patch('/profile/:id/points', UserController.updatePoints)

