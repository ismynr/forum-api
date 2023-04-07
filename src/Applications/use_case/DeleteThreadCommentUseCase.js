// eslint-disable-next-line no-unused-vars
const ThreadCommentRepository = require('../../Domains/threadComments/ThreadCommentRepository');

class DeleteThreadCommentUseCase {
  constructor({ threadCommentRepository }) {
    /** @type ThreadCommentRepository */
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { id, user_id: userId } = useCasePayload;
    await this._threadCommentRepository.getCommentById(id);
    await this._threadCommentRepository.verifyUsersComment(id, userId);
    return this._threadCommentRepository.deleteComment(id);
  }

  _validatePayload(payload) {
    const { id, user_id: userId } = payload;
    if (!id || !userId) {
      throw new Error('DELETE_THREAD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof userId !== 'string') {
      throw new Error('DELETE_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteThreadCommentUseCase;
