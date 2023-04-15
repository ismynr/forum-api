class GetThreadComment {
  constructor(payload) {
    this._validatePayload(payload);

    this.id = payload.id;
    this.content = payload.is_delete === 1
      ? '**komentar telah dihapus**'
      : payload.content;
    this.date = payload.date.toString();
    this.username = payload.username;
    this.is_delete = payload.is_delete;
  }

  _validatePayload({
    id, content, date, username, is_delete: isDelete,
  }) {
    if (!id || !content || !date || !username || (isDelete === null || isDelete === undefined)) {
      throw new Error('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || (typeof date !== 'string' && typeof date !== 'object')
      || typeof username !== 'string'
      || typeof isDelete !== 'number') {
      throw new Error('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadComment;
