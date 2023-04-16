const { DatabaseError } = require('pg');
const ThreadCommentLikesTableTestHelper = require('../../../../tests/ThreadCommentLikesTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../database/postgres/pool');
const ThreadCommentLikesRepositoryPostgres = require('../ThreadCommentLikesRepositoryPostgres');

describe('ThreadCommentLikesRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadCommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    pool.end();
  });

  describe('like function', () => {
    it('should throw error when comment cannot be update like by user', async () => {
      // Arrange
      const threadCommentLikesRepositoryPostgres = new ThreadCommentLikesRepositoryPostgres(pool);
      // Action & Assert
      await expect(threadCommentLikesRepositoryPostgres.like('comment-123', 'user-123')).rejects.toThrowError(DatabaseError);
    });

    it('should throw error when insert comment and user row are duplicate value', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'A content', thread_id: 'thread-123', user_id: 'user-123',
      });
      await ThreadCommentLikesTableTestHelper.like('comment-123', 'user-123');
      // eslint-disable-next-line max-len
      const threadCommentLikesRepositoryPostgres = new ThreadCommentLikesRepositoryPostgres(pool);
      // Action & Assert
      await expect(threadCommentLikesRepositoryPostgres.like('comment-123', 'user-123')).rejects.toThrowError(DatabaseError);
    });

    it('should return true and check comment has been liked by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'A content', thread_id: 'thread-123', user_id: 'user-123',
      });
      // eslint-disable-next-line max-len
      const threadCommentLikesRepositoryPostgres = new ThreadCommentLikesRepositoryPostgres(pool);
      // Action
      const like = await threadCommentLikesRepositoryPostgres.like('comment-123', 'user-123');
      // Assert
      const resultOfIsUserLike = await ThreadCommentLikesTableTestHelper.isUserLike('comment-123', 'user-123');
      expect(like).toEqual(true);
      expect(resultOfIsUserLike).toHaveLength(1);
    });
  });

  describe('unlike function', () => {
    it('should throw error when comment cannot be delete like by user', async () => {
      // Arrange
      const threadCommentLikesRepositoryPostgres = new ThreadCommentLikesRepositoryPostgres(pool);
      // Action & Assert
      await expect(threadCommentLikesRepositoryPostgres.unlike('comment-123', 'user-123')).rejects.toThrowError(InvariantError);
    });

    it('should return true and check comment like has been delete', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'A content', thread_id: 'thread-123', user_id: 'user-123',
      });
      await ThreadCommentLikesTableTestHelper.like('comment-123', 'user-123');
      // eslint-disable-next-line max-len
      const threadCommentLikesRepositoryPostgres = new ThreadCommentLikesRepositoryPostgres(pool);
      // Action
      const unlike = await threadCommentLikesRepositoryPostgres.unlike('comment-123', 'user-123');
      // Assert
      const resultOfIsUserLike = await ThreadCommentLikesTableTestHelper.isUserLike('comment-123', 'user-123');
      expect(unlike).toEqual(true);
      expect(resultOfIsUserLike).toHaveLength(0);
    });
  });

  describe('isUserLike function', () => {
    it('should return false when the user unlike the comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'A content', thread_id: 'thread-123', user_id: 'user-123',
      });
      // eslint-disable-next-line max-len
      const threadCommentLikesRepositoryPostgres = new ThreadCommentLikesRepositoryPostgres(pool);
      // Action
      const isUserLike = await threadCommentLikesRepositoryPostgres.isUserLike('comment-123', 'user-123');
      // Assert
      expect(isUserLike).toEqual(false);
    });

    it('should return true when the user like the comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'Jose' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'A content', thread_id: 'thread-123', user_id: 'user-123',
      });
      await ThreadCommentLikesTableTestHelper.like('comment-123', 'user-123');
      // eslint-disable-next-line max-len
      const threadCommentLikesRepositoryPostgres = new ThreadCommentLikesRepositoryPostgres(pool);
      // Action
      const isUserLike = await threadCommentLikesRepositoryPostgres.isUserLike('comment-123', 'user-123');
      // Assert
      expect(isUserLike).toEqual(true);
    });
  });
});
