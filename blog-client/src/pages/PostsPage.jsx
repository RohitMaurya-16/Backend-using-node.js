import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function PostsPage({ user }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const isAuthor = user?.role === 'AUTHOR';

  useEffect(() => {
    api
      .get('/posts')
      .then((data) => setPosts(data.posts || []))
      .catch((error) => console.error(error.message));
  }, []);

  return (
    <div>
      <nav className="nav">
        <h1>Blog</h1>
        <div className="nav-links">
          <Link to="/posts">Posts</Link>
          {user ? (
            isAuthor ? (
              <Link to="/dashboard">Dashboard</Link>
            ) : null
          ) : (
            <Link to="/login">Login</Link>
          )}
          {user ? (
            <button
              className="secondary-btn"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                window.location.reload();
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/register">Register</Link>
          )}
        </div>
      </nav>

      <div className="card hero-panel">
        <h2>Latest stories</h2>
        <p>
          Learn JWT authentication by exploring a real blog flow built with Express, Prisma, and a separate React frontend.
        </p>
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <article key={post.id} className="post-item">
            <h3>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h3>
            <div className="meta">
              <span>By {post.author.username}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
              <span className="status-badge">{post.published ? 'Published' : 'Draft'}</span>
            </div>
            <p>{post.content.substring(0, 180)}{post.content.length > 180 ? '...' : ''}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
