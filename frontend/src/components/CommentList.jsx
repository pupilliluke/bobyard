import CommentItem from './CommentItem';
import './CommentList.css';

function CommentList({
  comments,
  editingId,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
  votes,
  onVote,
  collapsedComments,
  onToggleCollapse,
  replyingTo,
  onReply,
  onSubmitReply,
  depth = 0
}) {
  if (comments.length === 0 && depth === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </div>
        <p className="empty-title">No comments yet</p>
        <p className="empty-subtitle">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className={`comment-list ${depth > 0 ? 'nested' : ''}`}>
      {comments.map((comment) => (
        <div key={comment.id} className="comment-thread">
          <CommentItem
            comment={comment}
            isEditing={editingId === comment.id}
            onEdit={() => onEdit(comment.id)}
            onUpdate={(text) => onUpdate(comment.id, text)}
            onDelete={() => onDelete(comment.id)}
            onCancelEdit={onCancelEdit}
            vote={votes[comment.id] || 0}
            onVote={(direction) => onVote(comment.id, direction)}
            isCollapsed={collapsedComments.has(comment.id)}
            onToggleCollapse={() => onToggleCollapse(comment.id)}
            isReplying={replyingTo === comment.id}
            onReply={() => onReply(comment.id)}
            onCancelReply={() => onReply(null)}
            onSubmitReply={(text) => onSubmitReply(text, comment.id)}
          />
          {/* Render nested replies */}
          {comment.replies && comment.replies.length > 0 && !collapsedComments.has(comment.id) && (
            <CommentList
              comments={comment.replies}
              editingId={editingId}
              onEdit={onEdit}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onCancelEdit={onCancelEdit}
              votes={votes}
              onVote={onVote}
              collapsedComments={collapsedComments}
              onToggleCollapse={onToggleCollapse}
              replyingTo={replyingTo}
              onReply={onReply}
              onSubmitReply={onSubmitReply}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentList;
