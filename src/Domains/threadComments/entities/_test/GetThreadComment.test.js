const GetThreadComment = require('../GetThreadComment');

describe('GetThreadComment entities', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {
      content: 'test',
    };
    // Action & Assert
    expect(() => new GetThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      id: 'A id',
      content: [],
      date: 'A date',
      username: 11111,
    };
    // Action & Assert
    expect(() => new GetThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetThreadComment object correctly', async () => {
    // Arrange
    const payload = {
      id: 'A id',
      content: 'A content',
      date: 'A date',
      username: 'A username',
    };
    // Action
    const {
      id, content, date, username,
    } = new GetThreadComment(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
