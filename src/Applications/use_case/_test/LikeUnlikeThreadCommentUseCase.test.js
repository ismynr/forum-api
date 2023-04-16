const ThreadCommentLikeRepository = require('../../../Domains/threadCommentLikes/ThreadCommentLikeRepository');
const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeUnlikeThreadCommentUseCase = require('../LikeUnlikeThreadCommentUseCase');

describe('LikeThreadCommentUseCase.test', () => {
  it('should throw error if use case payload not contain id', async () => {
    // Arrange
    const useCasePayload = {
      comment_id: 'comment-123',
    };
    const likeUnlikeThreadCommentUseCase = new LikeUnlikeThreadCommentUseCase({});

    // Action & Assert
    await expect(likeUnlikeThreadCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_UNLIKE_THREAD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if id not string', async () => {
    // Arrange
    const useCasePayload = {
      comment_id: 123,
      user_id: 'user-123',
    };
    const likeUnlikeThreadCommentUseCase = new LikeUnlikeThreadCommentUseCase({});

    // Action & Assert
    await expect(likeUnlikeThreadCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_UNLIKE_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the like thread comment action correctly', async () => {
    /// Arrange
    const user = {
      id: 'user-123',
      username: 'username',
    };
    const thread = {
      id: 'thread-123',
      title: 'A title of thread',
    };
    const comment = {
      id: 'comment-123',
      content: 'A content of comment',
      thread_id: thread.id,
      user_id: user.id,
    };
    const useCasePayload = {
      thread_id: thread.id,
      comment_id: comment.id,
      user_id: user.id,
    };
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();
    /** mocking needed function */
    mockThreadRepository.verifyFoundThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyFoundCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentLikeRepository.isUserLike = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockThreadCommentLikeRepository.unlike = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockThreadCommentLikeRepository.like = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    const likeUnlikeThreadCommentUseCase = new LikeUnlikeThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
    });

    // Action
    const addedComment = await likeUnlikeThreadCommentUseCase.execute(useCasePayload);

    // // Assert
    expect(addedComment).toEqual(true);
    expect(mockThreadRepository.verifyFoundThreadById)
      .toBeCalledWith(thread.id);
    expect(mockThreadCommentRepository.verifyFoundCommentById)
      .toBeCalledWith(comment.id);
    expect(mockThreadCommentLikeRepository.isUserLike)
      .toBeCalledWith(comment.id, user.id);
    expect(mockThreadCommentLikeRepository.like)
      .toBeCalledTimes(0);
    expect(mockThreadCommentLikeRepository.unlike)
      .toBeCalledWith(comment.id, user.id);
  });

  it('should orchestrating the unlike thread comment action correctly', async () => {
    /// Arrange
    const user = {
      id: 'user-123',
      username: 'username',
    };
    const thread = {
      id: 'thread-123',
      title: 'A title of thread',
    };
    const comment = {
      id: 'comment-123',
      content: 'A content of comment',
      thread_id: thread.id,
      user_id: user.id,
    };
    const useCasePayload = {
      thread_id: thread.id,
      comment_id: comment.id,
      user_id: user.id,
    };
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();
    /** mocking needed function */
    mockThreadRepository.verifyFoundThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyFoundCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentLikeRepository.isUserLike = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockThreadCommentLikeRepository.unlike = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockThreadCommentLikeRepository.like = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    const likeUnlikeThreadCommentUseCase = new LikeUnlikeThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
    });

    // Action
    const addedComment = await likeUnlikeThreadCommentUseCase.execute(useCasePayload);

    // // Assert
    expect(addedComment).toEqual(true);
    expect(mockThreadRepository.verifyFoundThreadById)
      .toBeCalledWith(thread.id);
    expect(mockThreadCommentRepository.verifyFoundCommentById)
      .toBeCalledWith(comment.id);
    expect(mockThreadCommentLikeRepository.isUserLike)
      .toBeCalledWith(comment.id, user.id);
    expect(mockThreadCommentLikeRepository.unlike)
      .toBeCalledTimes(0);
    expect(mockThreadCommentLikeRepository.like)
      .toBeCalledWith(comment.id, user.id);
  });
});
