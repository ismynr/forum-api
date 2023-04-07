// eslint-disable-next-line no-unused-vars
const ThreadCommentRepository = require('../../Domains/threadComments/ThreadCommentRepository');
// eslint-disable-next-line no-unused-vars
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class GetThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    /** @type ThreadRepository */
    this._threadRepository = threadRepository;
    /** @type ThreadCommentRepository */
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const thread = await this._threadRepository.getThreadById(useCasePayload.id);
    const comments = await this._threadCommentRepository.getCommentsByThreadId(useCasePayload.id);
    return comments.length > 0
      ? { ...thread, comments }
      : thread;
  }

  _validatePayload(payload) {
    const { id } = payload;
    if (!id) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_ID');
    }

    if (typeof id !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadUseCase;
