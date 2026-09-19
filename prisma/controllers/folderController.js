const fs = require('node:fs');
const path = require('node:path');

exports.listFolders = async (req, res) => {
  const folders = await req.prisma.folder.findMany({
    where: { userId: req.user.id },
    include: { files: true },
    orderBy: { createdAt: 'desc' },
  });

  res.render('folders/index', { title: 'Folders', folders });
};

exports.getCreateFolder = (req, res) => {
  res.render('folders/form', { title: 'Create Folder', folder: null, error: null });
};

exports.postCreateFolder = async (req, res) => {
  const { name, description } = req.body;

  try {
    const folder = await req.prisma.folder.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        userId: req.user.id,
      },
    });

    const folderPath = path.join(__dirname, '..', 'uploads', String(folder.id));
    fs.mkdirSync(folderPath, { recursive: true });

    req.flash('success', 'Folder created.');
    res.redirect('/folders');
  } catch (error) {
    console.error(error);
    res.status(400).render('folders/form', {
      title: 'Create Folder',
      folder: { name, description },
      error: 'Folder name may already exist.',
    });
  }
};

exports.getEditFolder = async (req, res) => {
  const folder = await req.prisma.folder.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user.id,
    },
  });

  if (!folder) return res.status(404).render('notFound', { title: 'Folder not found' });

  res.render('folders/form', { title: 'Edit Folder', folder, error: null });
};

exports.updateFolder = async (req, res) => {
  const { name, description } = req.body;

  try {
    await req.prisma.folder.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
      },
    });

    req.flash('success', 'Folder updated.');
    res.redirect('/folders');
  } catch (error) {
    console.error(error);
    res.status(400).render('folders/form', {
      title: 'Edit Folder',
      folder: { id: Number(req.params.id), name, description },
      error: 'Unable to update folder.',
    });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    await req.prisma.folder.delete({
      where: {
        id: Number(req.params.id),
        userId: req.user.id,
      },
    });

    req.flash('success', 'Folder deleted.');
    res.redirect('/folders');
  } catch (error) {
    console.error(error);
    res.status(400).render('error', {
      title: 'Delete error',
      message: 'Unable to delete folder.',
    });
  }
};

exports.viewFolder = async (req, res) => {
  const folder = await req.prisma.folder.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user.id,
    },
    include: { files: true },
  });

  if (!folder) {
    return res.status(404).render('notFound', { title: 'Folder not found' });
  }

  res.render('folders/detail', { title: folder.name, folder });
};
