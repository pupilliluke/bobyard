const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchComments() {
  try {
    const response = await fetch(`${API_BASE}/comments/`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  } catch {
    // Fallback to local JSON file if backend is not running
    const response = await fetch('/comments.json');
    if (!response.ok) throw new Error('Failed to fetch comments');
    const data = await response.json();
    return data.comments;
  }
}

export async function createComment(data) {
  const response = await fetch(`${API_BASE}/comments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create comment');
  return response.json();
}

export async function updateComment(id, data) {
  const response = await fetch(`${API_BASE}/comments/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update comment');
  return response.json();
}

export async function deleteComment(id) {
  const response = await fetch(`${API_BASE}/comments/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete comment');
}
