const AddedThreadComment = require('../AddedThreadComment');

describe('AddedThreadComment entities', () => {
  it('should throw error when payload not contain neede property', () => {
    // Arrange
    const payload = {
      content: 'A content',
    };
    // Action & Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when paylod did not meet data type specifiation', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: [],
      owner: 'user-123',
    };
    // Action & Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThreadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'A content',
      owner: 'user-123',
    };
    // Action
    const { id, content, owner } = new AddedThreadComment(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
