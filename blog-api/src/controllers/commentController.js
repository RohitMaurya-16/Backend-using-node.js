const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getCommentsByPost(req, res, next) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(req.params.postId) },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
}

async function createComment(req, res, next) {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Comment content is required',
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.postId) },
    });

    if (!post) {
      return res.status(404).json({ error: 'Not Found', message: 'Post not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: Number(req.params.postId),
        userId: Number(req.user.userId),
      },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
}

async function updateComment(req, res, next) {
  try {
    const { content } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Not Found', message: 'Comment not found' });
    }

    if (comment.userId !== Number(req.user.userId) && req.user.role !== 'AUTHOR') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not allowed to update this comment',
      });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number(req.params.id) },
      data: { content },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Not Found', message: 'Comment not found' });
    }

    if (comment.userId !== Number(req.user.userId) && req.user.role !== 'AUTHOR') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not allowed to delete this comment',
      });
    }

    await prisma.comment.delete({ where: { id: Number(req.params.id) } });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
};
