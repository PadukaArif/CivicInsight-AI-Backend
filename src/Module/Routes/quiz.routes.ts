import { Elysia, t } from 'elysia'
import { db } from '../../config/database'

export const quizRoutes = new Elysia({ prefix: '/quiz' })
  .get('/questions', ({ set }) => {
    try {
      const query = db.prepare("SELECT id, question, options, correct_answer AS correctAnswer FROM quiz_questions");
      const result = query.all() as any[];
      const parsed = result.map(q => {
        try {
          return { ...q, options: JSON.parse(q.options) };
        } catch {
          return { ...q, options: [] };
        }
      });
      return { success: true, data: parsed };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
  .post('/questions', ({ body, set }) => {
    try {
      const query = db.prepare(`
        INSERT INTO quiz_questions (question, options, correct_answer)
        VALUES (?, ?, ?)
      `);
      const result = query.run(
        body.question,
        JSON.stringify(body.options),
        body.correctAnswer
      );
      return { success: true, message: "Pertanyaan kuis baru berhasil ditambahkan", data: { id: result.lastInsertRowid } };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  }, {
    body: t.Object({
      question: t.String(),
      options: t.Array(t.Object({
        key: t.String(),
        text: t.String()
      })),
      correctAnswer: t.String()
    })
  })
  .delete('/questions/:id', ({ params, set }) => {
    try {
      const query = db.prepare("DELETE FROM quiz_questions WHERE id = ?");
      query.run(Number(params.id));
      return { success: true, message: "Pertanyaan kuis berhasil dihapus" };
    } catch (e: any) {
      set.status = 500;
      return { success: false, message: e.message };
    }
  })
