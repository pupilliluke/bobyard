import { useState, useEffect, useMemo } from 'react';
import { fetchComments, createComment, updateComment, deleteComment } from './api';
import CommentList from './components/CommentList';
import CommentForm from './components/CommentForm';
import './App.css';

function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [sortBy, setSortBy] = useState('best');
  const [collapsedComments, setCollapsedComments] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    loadComments();
  }, []);

  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    switch (sortBy) {
      case 'new':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'old':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'top':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'controversial':
        return sorted.sort((a, b) => Math.abs(50 - b.likes) - Math.abs(50 - a.likes));
      case 'best':
      default:
        return sorted.sort((a, b) => (b.likes * 0.7 + (new Date(b.date).getTime() / 1e12)) - (a.likes * 0.7 + (new Date(a.date).getTime() / 1e12)));
    }
  }, [comments, sortBy]);

  function handleVote(commentId, direction) {
    const currentVote = votes[commentId] || 0;
    let newVote = direction;
    if (currentVote === direction) {
      newVote = 0;
    }
    setVotes({ ...votes, [commentId]: newVote });
  }

  function toggleCollapse(commentId) {
    const newCollapsed = new Set(collapsedComments);
    if (newCollapsed.has(commentId)) {
      newCollapsed.delete(commentId);
    } else {
      newCollapsed.add(commentId);
    }
    setCollapsedComments(newCollapsed);
  }

  async function loadComments() {
    try {
      setLoading(true);
      const data = await fetchComments();
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddComment(text) {
    try {
      const newComment = await createComment({ text });
      setComments([newComment, ...comments]);
    } catch {
      // Fallback: create comment locally when backend is offline
      const newComment = {
        id: String(Date.now()),
        author: 'Admin',
        text: text,
        date: new Date().toISOString(),
        likes: 0,
        image: ''
      };
      setComments([newComment, ...comments]);
    }
  }

  async function handleUpdateComment(id, text) {
    try {
      const updated = await updateComment(id, { text });
      setComments(comments.map(c => c.id === id ? updated : c));
      setEditingComment(null);
    } catch {
      // Fallback: update comment locally when backend is offline
      setComments(comments.map(c => c.id === id ? { ...c, text } : c));
      setEditingComment(null);
    }
  }

  async function handleDeleteComment(id) {
    try {
      await deleteComment(id);
      setComments(comments.filter(c => c.id !== id));
    } catch {
      // Fallback: delete comment locally when backend is offline
      setComments(comments.filter(c => c.id !== id));
    }
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <a href="https://www.bobyard.com/" target="_blank" rel="noopener noreferrer" className="navbar-brand">
            <img src="/long-bobyard.svg" alt="Bobyard" className="navbar-logo" />
          </a>

          <div className="navbar-links">
            <a href="https://www.bobyard.com/" target="_blank" rel="noopener noreferrer" className="navbar-link">Product</a>
            <a href="https://www.bobyard.com/" target="_blank" rel="noopener noreferrer" className="navbar-link">Customer</a>
            <a href="https://www.bobyard.com/" target="_blank" rel="noopener noreferrer" className="navbar-link">
              Company
              <svg className="navbar-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </a>
            <a href="https://www.bobyard.com/" target="_blank" rel="noopener noreferrer" className="navbar-link">Blog</a>
            <a href="https://www.bobyard.com/" target="_blank" rel="noopener noreferrer" className="navbar-link">Partners</a>
          </div>

          <div className="navbar-actions">
            <a href="https://www.bobyard.com/" target="_blank" rel="noopener noreferrer" className="navbar-login">Login</a>
            <a href="https://www.bobyard.com/" target="_blank" rel="noopener noreferrer" className="navbar-demo">Demo</a>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="page-header">
        <div className="header-top">
          <h1>Comments</h1>
          <span className="comment-count">{comments.length} comments</span>
        </div>

        {/* Sort Controls */}
        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <div className="sort-buttons">
            {['best', 'top', 'new', 'controversial', 'old'].map((option) => (
              <button
                key={option}
                className={`sort-btn ${sortBy === option ? 'active' : ''}`}
                onClick={() => setSortBy(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="main">
        <CommentForm onSubmit={handleAddComment} />

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading comments...</span>
          </div>
        ) : (
          <CommentList
            comments={sortedComments}
            editingId={editingComment}
            onEdit={setEditingComment}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
            onCancelEdit={() => setEditingComment(null)}
            votes={votes}
            onVote={handleVote}
            collapsedComments={collapsedComments}
            onToggleCollapse={toggleCollapse}
            replyingTo={replyingTo}
            onReply={setReplyingTo}
            onSubmitReply={handleAddComment}
          />
        )}
      </main>

      <footer className="footer">
        Built by <a href="https://www.pupilli.dev" target="_blank" rel="noopener noreferrer">pupilli.dev</a> for <a href="https://www.bobyard.com/" target="_blank" rel="noopener noreferrer">Bobyard</a>
      </footer>
    </div>
  );
}

export default App;
