const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const user = {
      id: 'user-123',
      username: 'username',
    };
    const useCasePayload = {
      title: 'A Title',
      body: 'A Body',
      user_id: user.id,
    };
    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: user.username,
    });
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: user.username,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(useCasePayload));
  });
});
