const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

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
}

module.exports = ThreadRepositoryPostgres;
