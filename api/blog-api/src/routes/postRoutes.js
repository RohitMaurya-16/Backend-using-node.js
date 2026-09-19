const express = require('express');
const {
  getPublishedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
  getAuthorPosts,
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getPublishedPosts);
router.get('/mine', authMiddleware, getAuthorPosts);
router.get('/:id', getPostById);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.patch('/:id/publish', authMiddleware, togglePublish);

module.exports = router;
