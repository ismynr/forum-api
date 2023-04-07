const GetThread = require('../GetThread');

describe('GetThread entities', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {
      id: 'A id',
      title: 'A title',
      body: 'A body',
    };
    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      id: 12345,
      title: 'A title',
      body: 'A body',
      date: 'A date',
      username: 'A username',
    };
    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetThread object correctly', async () => {
    // Arrange
    const payload = {
      id: 'A id',
      title: 'A title',
      body: 'A body',
      date: 'A date',
      username: 'A username',
    };
    // Action
    const {
      id, title, body, date, username,
    } = new GetThread(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
