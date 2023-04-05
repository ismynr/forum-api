const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname',
      };
      const responseUsers = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      const responseJsonUser = JSON.parse(responseUsers.payload);
      const { addedUser } = responseJsonUser.data;
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
      /** Thread payload */
      const requestPayload = {
        title: 'A title',
        body: 'A body',
        user_id: addedUser.id,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname',
      };
      const responseUsers = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      const responseJsonUser = JSON.parse(responseUsers.payload);
      const { addedUser } = responseJsonUser.data;
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
      /** Thread payload */
      const requestPayload = {
        title: 'A title',
        user_id: addedUser.id,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname',
      };
      const responseUsers = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      const responseJsonUser = JSON.parse(responseUsers.payload);
      const { addedUser } = responseJsonUser.data;
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
      /** Thread payload */
      const requestPayload = {
        title: 'A title',
        body: 'A body',
        user_id: [addedUser.id],
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 401 when request doesn\'t have authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'A title',
        body: 'A body',
        user_id: 'user-123',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});
