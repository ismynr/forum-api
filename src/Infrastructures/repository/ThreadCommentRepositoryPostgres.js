const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadCommentRepository = require('../../Domains/threadComments/ThreadCommentRepository');
const AddedThreadComment = require('../../Domains/threadComments/entities/AddedThreadComment');
const GetThreadComment = require('../../Domains/threadComments/entities/GetThreadComment');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { content, thread_id: threadId, user_id: userId } = comment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comments(id, content, thread_id, user_id) VALUES($1, $2, $3, $4) RETURNING id, content, thread_id, user_id',
      values: [id, content, threadId, userId],
    };
    const result = await this._pool.query(query);
    return new AddedThreadComment(result.rows[0]);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM thread_comments INNER JOIN (SELECT id as user_id, username FROM users) users ON thread_comments.user_id = users.user_id WHERE thread_comments.thread_id = $1 ORDER BY thread_comments ASC',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows.map((comment) => new GetThreadComment(comment));
  }

  async verifyUsersComment(commentId, userId) {
    const query = {
      text: 'SELECT * FROM thread_comments INNER JOIN (SELECT id as user_id, username FROM users) users ON thread_comments.user_id = users.user_id WHERE id = $1 AND users.user_id = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Akses tidak dizinkan');
    }
  }

  async getCommentById(commentId) {
    const query = {
      text: 'SELECT * FROM thread_comments INNER JOIN (SELECT id as user_id, username FROM users) users ON thread_comments.user_id = users.user_id WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    return new GetThreadComment({
      ...result.rows[0],
      date: result.rows[0].date.toString(),
    });
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE thread_comments SET is_delete = 1 WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('tidak dapat menghapus comment ini');
    }
    return result.rowCount > 0;
  }
}

module.exports = ThreadCommentRepositoryPostgres;
