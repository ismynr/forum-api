class GetThreadComment {
  constructor(payload) {
    this._validatePayload(payload);

    this.id = payload.id;
    this.content = payload.is_delete === 1
      ? '**komentar telah dihapus**'
      : payload.content;
    this.date = payload.date.toString();
    this.username = payload.username;
    this.is_delete = Number(payload.is_delete);
    this.likeCount = Number(payload.likeCount);
  }

  _validatePayload({
    id, content, date, username, is_delete: isDelete, likeCount,
  }) {
    if (!id
      || !content
      || !date
      || !username
      || (isDelete === null || isDelete === undefined)
      || (likeCount === null || likeCount === undefined)
    ) {
      throw new Error('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof content !== 'string'
      || (typeof date !== 'string' && typeof date !== 'object')
      || typeof username !== 'string'
      || typeof isDelete !== 'number'
      || (typeof likeCount !== 'number' && typeof likeCount !== 'string')
    ) {
      throw new Error('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadComment;
