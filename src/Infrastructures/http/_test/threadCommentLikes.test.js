const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadCommentLikesTableTestHelper = require('../../../../tests/ThreadCommentLikesTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadCommentLikesTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when user like his own comment', async () => {
      // Arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      /** Add Thread */
      const requestPayloadThread = {
        title: 'A title',
        body: 'A body',
      };
      const responseThreads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThreads.payload);
      const { addedThread } = responseJsonThread.data;
      /** Add Comment */
      const requestPayloadComment = {
        content: 'A content',
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonComment = JSON.parse(responseComment.payload);
      const { addedComment } = responseJsonComment.data;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 when user like another user comment', async () => {
      // Arrange
      const server = await createServer(container);
      /** Add user 1 to create thread */
      const requestPayloadUser = {
        username: 'jerry',
        password: 'password',
        fullname: 'Jerry Curut',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      /** Add thread */
      const requestPayloadThread = {
        title: 'A title',
        body: 'A body',
      };
      const responseThreads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThreads.payload);
      const { addedThread } = responseJsonThread.data;
      /** Add user 2 to comment Jerry's thread */
      const requestPayloadUserTom = {
        username: 'tom',
        password: 'password',
        fullname: 'Tom Kucing',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUserTom,
      });
      /** Login user Tom */
      const responseAuthsTom = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUserTom.username,
          password: requestPayloadUserTom.password,
        },
      });
      const responseJsonAuthTom = JSON.parse(responseAuthsTom.payload);
      const { accessToken: accessTokenTom } = responseJsonAuthTom.data;
      /** Add Comment */
      const requestPayloadComment = {
        content: 'A content',
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonComment = JSON.parse(responseComment.payload);
      const { addedComment } = responseJsonComment.data;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessTokenTom}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 when user unlike another user comment', async () => {
      // Arrange
      const server = await createServer(container);
      /** Add user 1 to create thread */
      const requestPayloadUser = {
        username: 'jerry',
        password: 'password',
        fullname: 'Jerry Curut',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      /** Add thread */
      const requestPayloadThread = {
        title: 'A title',
        body: 'A body',
      };
      const responseThreads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThreads.payload);
      const { addedThread } = responseJsonThread.data;
      /** Add user 2 to comment Jerry's thread */
      const requestPayloadUserTom = {
        username: 'tom',
        password: 'password',
        fullname: 'Tom Kucing',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUserTom,
      });
      /** Login user Tom */
      const responseAuthsTom = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUserTom.username,
          password: requestPayloadUserTom.password,
        },
      });
      const responseJsonAuthTom = JSON.parse(responseAuthsTom.payload);
      const { accessToken: accessTokenTom } = responseJsonAuthTom.data;
      /** Add Comment */
      const requestPayloadComment = {
        content: 'A content',
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonComment = JSON.parse(responseComment.payload);
      const { addedComment } = responseJsonComment.data;
      await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessTokenTom}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessTokenTom}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      /** Add thread */
      const threadIdFake = 'thread-123';
      const commentIdFake = 'comment-123';

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadIdFake}/comments/${commentIdFake}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      /** Add thread */
      const requestPayloadThread = {
        title: 'A title',
        body: 'A body',
      };
      const responseThreads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThreads.payload);
      const { addedThread } = responseJsonThread.data;
      const commentIdFake = 'comment-123';

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${commentIdFake}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 401 when request doesn\'t have authentication', async () => {
      // Arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      /** Add thread */
      const requestPayloadThread = {
        title: 'A title',
        body: 'A body',
      };
      const responseThreads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThreads.payload);
      const { addedThread } = responseJsonThread.data;
      /** Add Comment */
      const requestPayloadComment = {
        content: 'A content',
      };
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonComment = JSON.parse(responseComment.payload);
      const { addedComment } = responseJsonComment.data;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});
