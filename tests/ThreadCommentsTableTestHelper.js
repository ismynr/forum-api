/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'A content',
    thread_id: threadId = 'thread-123',
    user_id: userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO thread_comments(id, content, thread_id, user_id) VALUES($1, $2, $3, $4)',
      values: [id, content, threadId, userId],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteComment(id) {
    const query = {
      text: 'UPDATE thread_comments SET is_delete = 1 WHERE id = $1',
      values: [id],
    };

    return pool.query(query);
  },

  async findCommentsByIdWitFalseIsDelete(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND is_delete = 0',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
