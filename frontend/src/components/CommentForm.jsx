import { useState } from 'react';
import './CommentForm.css';

function CommentForm({ onSubmit }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <span className="form-label">Comment as</span>
        <div className="admin-avatar">A</div>
        <span className="admin-label">Admin</span>
      </div>
      <textarea
        className="form-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What are your thoughts?"
        rows={4}
      />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
          Comment
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
