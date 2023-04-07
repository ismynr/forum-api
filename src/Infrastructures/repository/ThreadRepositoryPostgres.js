const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GetThread = require('../../Domains/threads/entities/GetThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { title, body, user_id: userId } = thread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads(id, title, body, user_id) VALUES($1, $2, $3, $4) RETURNING id, title, body, user_id',
      values: [id, title, body, userId],
    };
    const result = await this._pool.query(query);
    return new AddedThread({
      ...result.rows[0],
      owner: result.rows[0].user_id,
    });
  }

  async verifyFoundThreadById(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT * FROM threads INNER JOIN (SELECT id as user_id, username FROM users) users ON threads.user_id = users.user_id WHERE threads.id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return new GetThread({
      ...result.rows[0],
      date: result.rows[0].date.toString(),
    });
  }
}

module.exports = ThreadRepositoryPostgres;
