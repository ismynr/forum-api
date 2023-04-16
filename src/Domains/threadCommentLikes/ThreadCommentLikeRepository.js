/* eslint-disable no-unused-vars */
class ThreadCommentLikeRepository {
  async like(commentId, userId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async unlike(commentId, userId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async isUserLike(commentId, userId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentLikeRepository;
