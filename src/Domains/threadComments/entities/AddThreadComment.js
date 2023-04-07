class AddThreadComment {
  constructor(payload) {
    this._validatePayload(payload);

    this.content = payload.content;
    this.thread_id = payload.thread_id;
    this.user_id = payload.user_id;
  }

  _validatePayload({ content, thread_id: threadId, user_id: userId }) {
    if (!content || !threadId || !userId) {
      throw new Error('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof userId !== 'string') {
      throw new Error('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadComment;
