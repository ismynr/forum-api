// eslint-disable-next-line no-unused-vars
const ThreadCommentLikeRepository = require('../../Domains/threadCommentLikes/ThreadCommentLikeRepository');
// eslint-disable-next-line no-unused-vars
const ThreadCommentRepository = require('../../Domains/threadComments/ThreadCommentRepository');
// eslint-disable-next-line no-unused-vars
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class LikeUnlikeThreadCommentUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
    threadCommentLikeRepository,
  }) {
    /** @type ThreadRepository */
    this._threadRepository = threadRepository;
    /** @type ThreadCommentRepository */
    this._threadCommentRepository = threadCommentRepository;
    /** @type ThreadCommentLikeRepository */
    this._threadCommentLikeRepository = threadCommentLikeRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { comment_id: commentId, user_id: userId, thread_id: threadId } = useCasePayload;
    await this._threadRepository.verifyFoundThreadById(threadId);
    await this._threadCommentRepository.verifyFoundCommentById(commentId);
    const isUserLike = await this._threadCommentLikeRepository.isUserLike(commentId, userId);
    if (isUserLike) {
      return this._threadCommentLikeRepository.unlike(commentId, userId);
    }
    return this._threadCommentLikeRepository.like(commentId, userId);
  }

  _validatePayload(payload) {
    const { comment_id: commentId, user_id: userId } = payload;
    if (!commentId || !userId) {
      throw new Error('LIKE_UNLIKE_THREAD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof commentId !== 'string') {
      throw new Error('LIKE_UNLIKE_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeUnlikeThreadCommentUseCase;
