const InvariantError = require('../../Commons/exceptions/InvariantError');
const ThreadCommentLikeRepository = require('../../Domains/threadCommentLikes/ThreadCommentLikeRepository');

class ThreadCommentLikesRepositoryPostgres extends ThreadCommentLikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async like(commentId, userId) {
    const query = {
      text: 'INSERT INTO thread_comment_likes(comment_id, user_id) VALUES($1, $2)',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async unlike(commentId, userId) {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal batal menyukai komentar');
    }
    return result.rowCount > 0;
  }

  async isUserLike(commentId, userId) {
    const query = {
      text: 'SELECT * FROM thread_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }
}

module.exports = ThreadCommentLikesRepositoryPostgres;
