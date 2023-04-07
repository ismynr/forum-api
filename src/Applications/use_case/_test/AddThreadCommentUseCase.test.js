const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository');
const AddComment = require('../../../Domains/threadComments/entities/AddThreadComment');
const AddedComment = require('../../../Domains/threadComments/entities/AddedThreadComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const user = {
      id: 'user-123',
      username: 'username',
    };
    const thread = {
      id: 'thread-123',
      title: 'A title of thread',
    };
    const useCasePaylaod = {
      content: 'A content of comment',
      thread_id: thread.id,
      user_id: user.id,
    };
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'A content of comment',
      owner: 'id of user that comment',
    });
    /** creating dependency of use case */
    const mockCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();
    /** mocking needed function */
    mockThreadRepository.verifyFoundThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePaylaod);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: 'A content of comment',
      owner: 'id of user that comment',
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(useCasePaylaod));
    expect(mockThreadRepository.verifyFoundThreadById).toBeCalledWith(thread.id);
  });
});
