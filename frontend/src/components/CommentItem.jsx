import { useState } from 'react';
import './CommentItem.css';

function CommentItem({
  comment,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
  vote,
  onVote,
  isCollapsed,
  onToggleCollapse,
  isReplying,
  onReply,
  onCancelReply,
  onSubmitReply
}) {
  const [editText, setEditText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');
  const [saved, setSaved] = useState(false);

  const effectiveLikes = comment.likes + vote;

  function handleSave() {
    if (editText.trim()) {
      onUpdate(editText);
    }
  }

  function handleCancel() {
    setEditText(comment.text);
    onCancelEdit();
  }

  function handleReplySubmit() {
    if (replyText.trim()) {
      onSubmitReply(replyText);
      setReplyText('');
      onCancelReply();
    }
  }

  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  }

  if (isCollapsed) {
    return (
      <div className="comment-item collapsed">
        <button className="collapse-btn expand" onClick={onToggleCollapse} title="Expand">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
        <div className="collapsed-info">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-separator">•</span>
          <span className="collapsed-score">{effectiveLikes} points</span>
          <span className="comment-separator">•</span>
          <span className="comment-date">{formatTimeAgo(comment.date)}</span>
          <span className="collapsed-hint">(click to expand)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="comment-item">
      {/* Collapse line */}
      <div className="thread-line-container">
        <button className="collapse-line" onClick={onToggleCollapse} title="Collapse thread">
          <div className="collapse-line-inner"></div>
        </button>
      </div>

      {/* Vote column */}
      <div className="vote-column">
        <button
          className={`vote-btn upvote ${vote === 1 ? 'active' : ''}`}
          onClick={() => onVote(1)}
          title="Upvote"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M12 4l-8 8h5v8h6v-8h5z"/>
          </svg>
        </button>
        <span className={`vote-count ${vote === 1 ? 'upvoted' : vote === -1 ? 'downvoted' : ''}`}>
          {effectiveLikes}
        </span>
        <button
          className={`vote-btn downvote ${vote === -1 ? 'active' : ''}`}
          onClick={() => onVote(-1)}
          title="Downvote"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M12 20l8-8h-5v-8h-6v8h-5z"/>
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="comment-main">
        <div className="comment-header">
          <div className="author-avatar">
            {comment.author.charAt(0).toUpperCase()}
          </div>
          <span className="comment-author">{comment.author}</span>
          <span className="comment-separator">•</span>
          <span className="comment-date">{formatTimeAgo(comment.date)}</span>
        </div>

        {isEditing ? (
          <div className="edit-mode">
            <textarea
              className="edit-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="edit-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-text">{comment.text}</p>

            {comment.image && (
              <div className="comment-image-container">
                <img
                  src={comment.image}
                  alt="Comment attachment"
                  className="comment-image"
                  onError={(e) => e.target.parentElement.style.display = 'none'}
                />
              </div>
            )}

            <div className="comment-actions">
              <button className="action-btn" onClick={onReply}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                Reply
              </button>
              <button className={`action-btn ${saved ? 'saved' : ''}`} onClick={() => setSaved(!saved)}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d={saved
                    ? "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"
                    : "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"
                  }/>
                </svg>
                {saved ? 'Saved' : 'Save'}
              </button>
              <button className="action-btn" onClick={onEdit}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
              <button className="action-btn" onClick={() => navigator.clipboard.writeText(comment.text)}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
                Share
              </button>
              <button className="action-btn delete-btn" onClick={onDelete}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </div>

            {/* Reply form */}
            {isReplying && (
              <div className="reply-form">
                <textarea
                  className="reply-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.author}...`}
                  rows={3}
                  autoFocus
                />
                <div className="reply-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    setReplyText('');
                    onCancelReply();
                  }}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
