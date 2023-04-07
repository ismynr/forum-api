const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository');
const GetThreadComment = require('../../../Domains/threadComments/entities/GetThreadComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error if use case payload not contain id', async () => {
    // Arrange
    const useCasePayload = {};
    const getThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_ID');
  });

  it('should throw error if id not string', async () => {
    // Arrange
    const useCasePayload = {
      id: 123,
    };
    const getThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const user = {
      id: 'user-123',
      username: 'username',
    };
    const useCasePayload = {
      id: 'thread-123',
    };
    const mockGetThread = new GetThread({
      id: useCasePayload.id,
      title: 'A Title',
      body: 'A Body',
      date: 'A Date',
      username: user.username,
    });
    const mockGetThreadComment = new GetThreadComment({
      id: 'comment-123',
      content: 'A Content',
      date: 'A Date',
      username: user.username,
    });
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    /** mocking needed function */
    mockThreadCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([mockGetThreadComment]));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetThread));
    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual({ ...mockGetThread, comments: [mockGetThreadComment] });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockGetThread.id);
    expect(mockThreadCommentRepository.getCommentsByThreadId).toBeCalledWith(mockGetThread.id);
  });
});
