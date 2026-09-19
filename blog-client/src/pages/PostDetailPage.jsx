import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function PostDetailPage({ user }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const isAuthor = user?.role === 'AUTHOR';

  async function loadPost() {
    try {
      const data = await api.get(`/posts/${id}`);
      setPost(data.post);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    loadPost();
  }, [id]);

  async function submitComment() {
    if (!user) return;

    try {
      await api.post(`/posts/${id}/comments`, { content: comment });
      setComment('');
      loadPost();
    } catch (error) {
      console.error(error.message);
    }
  }

  if (!post) {
    return <div className="card">Loading post...</div>;
  }

  return (
    <div>
      <nav className="nav">
        <h1>Post Details</h1>
        <div className="nav-links">
          <Link to="/posts">All Posts</Link>
          {user ? (
            isAuthor ? <Link to="/dashboard">Dashboard</Link> : null
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <article className="card">
        <h2>{post.title}</h2>
        <div className="meta">
          By {post.author.username} • {new Date(post.createdAt).toLocaleString()}
          {post.published ? <span className="status-badge">Published</span> : <span className="status-badge">Draft</span>}
        </div>
        <p>{post.content}</p>
      </article>

      <div className="card">
        <h3>Comments</h3>
        {post.comments.length === 0 ? <p>No comments yet.</p> : null}
        {post.comments.map((item) => (
          <div key={item.id} className="post-item">
            <strong>{item.user.username}</strong>
            <p>{item.content}</p>
          </div>
        ))}

        {user ? (
          <div className="form">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." />
            <button className="primary-btn" onClick={submitComment}>Add Comment</button>
          </div>
        ) : (
          <p>Please <Link to="/login">log in</Link> to comment.</p>
        )}
      </div>
    </div>
  );
}
