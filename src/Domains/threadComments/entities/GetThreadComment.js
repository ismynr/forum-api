class GetThreadComment {
  constructor(payload) {
    this._validatePayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.date = payload.date;
    this.username = payload.username;
  }

  _validatePayload({
    id, content, date, username,
  }) {
    if (!id || !content || !date || !username) {
      throw new Error('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string') {
      throw new Error('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadComment;
