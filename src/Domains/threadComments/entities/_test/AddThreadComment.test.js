const AddThreadComment = require('../AddThreadComment');

describe('AddThreadComment entities', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {
      content: 'test',
    };
    // Action & Assert
    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      content: [],
      thread_id: 11111,
      user_id: 'user-123',
    };
    // Action & Assert
    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThreadComment object correctly', async () => {
    // Arrange
    const payload = {
      content: 'A content',
      thread_id: 'thread-123',
      user_id: 'user-123',
    };
    // Action
    const { content, thread_id: threadId, user_id: userId } = new AddThreadComment(payload);
    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.thread_id);
    expect(userId).toEqual(payload.user_id);
  });
});
