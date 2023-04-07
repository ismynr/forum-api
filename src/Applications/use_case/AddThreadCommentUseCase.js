// eslint-disable-next-line no-unused-vars
const ThreadCommentRepository = require('../../Domains/threadComments/ThreadCommentRepository');
const AddThreadComment = require('../../Domains/threadComments/entities/AddThreadComment');
// eslint-disable-next-line no-unused-vars
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class AddThreadCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    /** @type ThreadCommentRepository */
    this._commentRepository = commentRepository;
    /** @type ThreadRepository */
    this._threadRepository = threadRepository;
  }

  async execute(useCasePaylaod) {
    const addComment = new AddThreadComment(useCasePaylaod);
    await this._threadRepository.verifyFoundThreadById(useCasePaylaod.thread_id);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddThreadCommentUseCase;
