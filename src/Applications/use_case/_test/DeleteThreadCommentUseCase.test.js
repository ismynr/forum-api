const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository');
const GetThreadComment = require('../../../Domains/threadComments/entities/GetThreadComment');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  it('should throw error if use case payload not contain id', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({});

    // Action & Assert
    await expect(deleteThreadCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_THREAD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if id not string', async () => {
    // Arrange
    const useCasePayload = {
      id: 123,
      user_id: 'user-123',
    };
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({});

    // Action & Assert
    await expect(deleteThreadCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const user = {
      id: 'user-123',
      username: 'username',
    };
    const useCasePayload = {
      id: 'comment-123',
      user_id: user.id,
    };
    const mockGetThreadComment = new GetThreadComment({
      id: 'comment-123',
      content: 'A Content',
      date: 'A Date',
      username: user.username,
    });
    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();
    /** mocking needed function */
    mockThreadCommentRepository.verifyUsersComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetThreadComment));
    mockThreadCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    /** creating use case instance */
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const deleteThreadComment = await deleteThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(deleteThreadComment).toEqual(true);
    expect(mockThreadCommentRepository.verifyUsersComment)
      .toBeCalledWith(mockGetThreadComment.id, user.id);
    expect(mockThreadCommentRepository.getCommentById)
      .toBeCalledWith(mockGetThreadComment.id);
    expect(mockThreadCommentRepository.deleteComment)
      .toBeCalledWith(mockGetThreadComment.id);
  });
});
