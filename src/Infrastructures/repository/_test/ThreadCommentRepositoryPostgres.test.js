const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThreadComment = require('../../../Domains/threadComments/entities/AddedThreadComment');
const GetThreadComment = require('../../../Domains/threadComments/entities/GetThreadComment');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
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
      /** second add thread row */
      const addThread = new AddThread({
        title: 'A Title',
        body: 'A Body',
        user_id: registeredUser.id,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const addedThread = await threadRepositoryPostgres.addThread(addThread);
      /** and third add thread row with user id value from registeredUser */
      const comment = {
        content: 'A Content',
        thread_id: addedThread.id,
        user_id: registeredUser.id,
      };
      const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(comment);

      // Assert
      const commentHelper = await ThreadCommentsTableTestHelper.findCommentsById('comment-123');
      expect(commentHelper).toHaveLength(1);
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
      /** second add thread row */
      const addThread = new AddThread({
        title: 'A Title',
        body: 'A Body',
        user_id: registeredUser.id,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const addedThread = await threadRepositoryPostgres.addThread(addThread);
      /** and third add thread row with user id value from registeredUser */
      const comment = {
        content: 'A Content',
        thread_id: addedThread.id,
        user_id: registeredUser.id,
      };
      const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(comment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedThreadComment({
        id: 'comment-123',
        content: comment.content,
        user_id: registeredUser.id,
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should empty array when thread not found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});
      // Action & Assert
      const threadComments = await threadCommentRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(threadComments.length).toEqual(0);
    });

    it('should return array of list comments when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'content', thread_id: 'thread-123', user_id: 'user-123',
      });
      const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].content).toEqual('content');
      expect(comments[0].username).toEqual('Jose');
      expect(comments[0].is_delete).toEqual(0);
      expect(comments[0]).toStrictEqual(new GetThreadComment({
        id: 'comment-123',
        content: 'content',
        date: comments[0].date,
        username: 'Jose',
        is_delete: 0,
      }));
    });
  });

  describe('verifyUsersComment function', () => {
    it('should throw error when user doesn\'t have action access for this comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'content', thread_id: 'thread-123', user_id: 'user-123',
      });
      const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyUsersComment('comment-123', 'user-12345')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when user doesn\'t have action access for this comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'content', thread_id: 'thread-123', user_id: 'user-123',
      });
      const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyUsersComment('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentById function', () => {
    it('should throw error when comment not found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(threadCommentRepositoryPostgres.getCommentById('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return detail of comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'content', thread_id: 'thread-123', user_id: 'user-123',
      });
      const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comment).toStrictEqual(new GetThreadComment({
        id: 'comment-123',
        content: 'content',
        date: comment.date,
        username: 'Jose',
        is_delete: 0,
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should throw error when comment cannot be delete', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(threadCommentRepositoryPostgres.deleteComment('comment-123')).rejects.toThrowError(InvariantError);
    });

    it('should return true and not found comment if the comment has been delete', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'content', thread_id: 'thread-123', user_id: 'user-123',
      });
      const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const deleteComment = await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const threadComment = await ThreadCommentsTableTestHelper.findCommentsByIdWitFalseIsDelete('comment-123');
      expect(deleteComment).toEqual(true);
      expect(threadComment).toHaveLength(0);
    });
  });
});
