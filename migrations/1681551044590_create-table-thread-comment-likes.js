/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comment_likes', {
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('thread_comment_likes', 'fk_comments.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE');
  pgm.addConstraint('thread_comment_likes', 'fk_thread_comment_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.createIndex('thread_comment_likes', ['comment_id', 'user_id'], { unique: true });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment_likes');
};
