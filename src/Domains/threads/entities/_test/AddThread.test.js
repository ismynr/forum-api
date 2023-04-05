const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {
      title: 'Title',
    };
    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      title: 123,
      body: 'Body',
      user_id: 'user-123',
    };
    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', async () => {
    // Arrange
    const payload = {
      title: 'A title',
      body: 'a body',
      user_id: 'user-123',
    };
    // Action
    const { title, body, user_id: userId } = new AddThread(payload);
    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(userId).toEqual(payload.user_id);
  });
});
