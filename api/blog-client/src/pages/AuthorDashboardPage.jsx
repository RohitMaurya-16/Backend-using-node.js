import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const emptyForm = { title: '', content: '', published: false };

export default function AuthorDashboardPage({ user, setUser }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingPostId, setEditingPostId] = useState(null);

  async function loadPosts() {
    try {
      const data = await api.get('/posts/mine');
      setPosts(data.posts || []);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'AUTHOR') {
      navigate('/posts');
      return;
    }

    loadPosts();
  }, [user, navigate]);

  function resetForm() {
    setForm(emptyForm);
    setEditingPostId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (editingPostId) {
        await api.put(`/posts/${editingPostId}`, form);
      } else {
        await api.post('/posts', form);
      }

      resetForm();
      loadPosts();
    } catch (error) {
      console.error(error.message);
    }
  }

  function startEdit(post) {
    setEditingPostId(post.id);
    setForm({
      title: post.title,
      content: post.content,
      published: post.published,
    });
  }

  async function togglePublish(postId) {
    try {
      await api.patch(`/posts/${postId}/publish`);
      loadPosts();
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deletePost(postId) {
    try {
      await api.delete(`/posts/${postId}`);
      loadPosts();
    } catch (error) {
      console.error(error.message);
    }
  }

  if (!user) {
    return null;
  }

  const canManagePosts = user.role === 'AUTHOR';

  return (
    <div>
      <nav className="nav">
        <h1>Author Dashboard</h1>
        <div className="nav-links">
          <Link to="/posts">Posts</Link>
          <button
            className="secondary-btn"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {!canManagePosts && (
        <div className="card">
          <p>This dashboard is for authors only. Your account role is {user.role}.</p>
        </div>
      )}

      {canManagePosts && (
        <>
          <div className="card">
            <h3>{editingPostId ? 'Edit Post' : 'Create New Post'}</h3>
            <form className="form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <label>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                Publish immediately
              </label>

              <div className="row">
                <button className="primary-btn" type="submit">
                  {editingPostId ? 'Update Post' : 'Create Post'}
                </button>
                {editingPostId && (
                  <button type="button" className="secondary-btn" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card">
            <h3>My Posts</h3>
            {posts.length === 0 ? <p>No posts yet.</p> : null}
            {posts.map((post) => (
              <div key={post.id} className="post-item">
                <div className="row">
                  <h4>{post.title}</h4>
                  <span className="status-badge">{post.published ? 'Published' : 'Draft'}</span>
                </div>
                <p>{post.content}</p>
                <div className="row">
                  <button className="secondary-btn" onClick={() => togglePublish(post.id)}>
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="primary-btn" onClick={() => startEdit(post)}>
                    Edit
                  </button>
                  <button className="primary-btn" onClick={() => navigate(`/posts/${post.id}`)}>
                    View
                  </button>
                  <button className="danger-btn" onClick={() => deletePost(post.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
