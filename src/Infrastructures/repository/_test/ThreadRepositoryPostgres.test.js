const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      /** add user row first */
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      /** and second add thread row with user id value from registeredUser */
      const thread = {
        title: 'A Title',
        body: 'A Body',
        user_id: registeredUser.id,
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threadHelper = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threadHelper).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      /** add user row first */
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      /** and second add thread row with user id value from registeredUser */
      const thread = {
        title: 'A Title',
        body: 'A Body',
        user_id: registeredUser.id,
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: thread.title,
        owner: registeredUser.id,
      }));
    });
  });

  describe('verifyFoundThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyFoundThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyFoundThreadById('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return detail of thread when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'username' });
      const thread = {
        id: 'thread-123',
        title: 'A title',
        body: 'A body',
        user_id: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(thread);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const getThreadById = await threadRepositoryPostgres.getThreadById('thread-123');
      // Action & Assert
      expect(getThreadById).toStrictEqual(new GetThread({
        ...thread,
        username: 'username',
        date: getThreadById.date,
      }));
    });
  });
});
