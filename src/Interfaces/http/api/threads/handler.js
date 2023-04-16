const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const LikeUnlikeThreadCommentUseCase = require('../../../../Applications/use_case/LikeUnlikeThreadCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.likeUnlikeThreadCommentHandler = this.likeUnlikeThreadCommentHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      user_id: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postThreadCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const addedComment = await addCommentUseCase.execute({
      ...request.payload,
      thread_id: threadId,
      user_id: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { commentId } = request.params;
    await deleteCommentUseCase.execute({
      id: commentId,
      user_id: credentialId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const { threadId } = request.params;
    const thread = await getThreadUseCase.execute({
      id: threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }

  async likeUnlikeThreadCommentHandler(request, h) {
    const likeUnlikeThreadCommentUseCase = this._container
      .getInstance(LikeUnlikeThreadCommentUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await likeUnlikeThreadCommentUseCase.execute({
      thread_id: threadId,
      comment_id: commentId,
      user_id: credentialId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
