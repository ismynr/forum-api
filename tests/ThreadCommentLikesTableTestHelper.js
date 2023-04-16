/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentLikesTableTestHelper = {
  async like(
    commentId = 'comment-123',
    userId = 'user-123',
  ) {
    const query = {
      text: 'INSERT INTO thread_comment_likes(comment_id, user_id) VALUES($1, $2)',
      values: [commentId, userId],
    };

    await pool.query(query);
  },

  async unlike(
    commentId = 'comment-123',
    userId = 'user-123',
  ) {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await pool.query(query);
  },

  async isUserLike(commentId, userId) {
    const query = {
      text: 'SELECT * FROM thread_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_likes WHERE 1=1');
  },
};

module.exports = ThreadCommentLikesTableTestHelper;
