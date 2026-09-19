const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getPublishedPosts(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
}

async function getPostById(req, res, next) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(req.params.id),
        published: true,
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Not Found', message: 'Post not found' });
    }

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const { title, content, published = false } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Title and content are required',
      });
    }

    if (req.user.role !== 'AUTHOR') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only authors can create posts',
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: Boolean(published),
        authorId: Number(req.user.userId),
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const { title, content, published } = req.body;

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Not Found', message: 'Post not found' });
    }

    if (existingPost.authorId !== Number(req.user.userId) && req.user.role !== 'AUTHOR') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not allowed to update this post',
      });
    }

    if (req.user.role !== 'AUTHOR' && existingPost.authorId !== Number(req.user.userId)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only authors can update posts',
      });
    }

    const post = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!post) {
      return res.status(404).json({ error: 'Not Found', message: 'Post not found' });
    }

    if (post.authorId !== Number(req.user.userId) && req.user.role !== 'AUTHOR') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not allowed to delete this post',
      });
    }

    await prisma.post.delete({ where: { id: Number(req.params.id) } });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function togglePublish(req, res, next) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!post) {
      return res.status(404).json({ error: 'Not Found', message: 'Post not found' });
    }

    if (post.authorId !== Number(req.user.userId) && req.user.role !== 'AUTHOR') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not allowed to publish this post',
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: {
        published: !post.published,
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json({ post: updatedPost });
  } catch (error) {
    next(error);
  }
}

async function getAuthorPosts(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: Number(req.user.userId) },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true },
        },
        comments: true,
      },
    });

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublishedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
  getAuthorPosts,
};
