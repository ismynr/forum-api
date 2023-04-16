const ThreadCommentLikeRepository = require('../ThreadCommentLikeRepository');

describe('ThreadCommentLikeRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadCommentLikeRepository = new ThreadCommentLikeRepository();
    // Action & Assert
    await expect(threadCommentLikeRepository.like({})).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentLikeRepository.unlike({})).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentLikeRepository.isUserLike({})).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
