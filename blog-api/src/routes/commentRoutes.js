const express = require('express');
const {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/posts/:postId/comments', getCommentsByPost);
router.post('/posts/:postId/comments', authMiddleware, createComment);
router.put('/comments/:id', authMiddleware, updateComment);
router.delete('/comments/:id', authMiddleware, deleteComment);

module.exports = router;
