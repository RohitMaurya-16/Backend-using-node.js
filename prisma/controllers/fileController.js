const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderId = req.body.folderId || req.params.folderId || 'general';
    const destination = path.join(uploadsDir, String(folderId));
    fs.mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const safeName = `${uuidv4()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024),
  },
  fileFilter: (req, file, cb) => {
    const allowed = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,application/pdf,text/plain').split(',');
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type.'));
    }
  },
});

exports.uploadMiddleware = upload.single('file');

exports.getUploadForm = async (req, res) => {
  const folders = await req.prisma.folder.findMany({
    where: { userId: req.user.id },
    orderBy: { name: 'asc' },
  });

  res.render('folders/upload', { title: 'Upload File', folders, error: null });
};

exports.postUpload = async (req, res) => {
  const folderId = Number(req.body.folderId);

  if (!req.file) {
    return res.status(400).render('folders/upload', {
      title: 'Upload file',
      folders: await req.prisma.folder.findMany({ where: { userId: req.user.id } }),
      error: 'Please choose a valid file to upload.',
    });
  }

  try {
    const fileUrl = `/uploads/${folderId}/${req.file.filename}`;

    await req.prisma.fileRecord.create({
      data: {
        name: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        fileUrl,
        storageMode: 'local',
        userId: req.user.id,
        folderId,
      },
    });

    req.flash('success', 'File uploaded successfully.');
    res.redirect(`/folders/${folderId}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('folders/upload', {
      title: 'Upload file',
      folders: await req.prisma.folder.findMany({ where: { userId: req.user.id } }),
      error: 'Unable to upload the file right now.',
    });
  }
};

exports.viewFile = async (req, res) => {
  const file = await req.prisma.fileRecord.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user.id,
    },
    include: { folder: true },
  });

  if (!file) {
    return res.status(404).render('notFound', { title: 'File not found' });
  }

  res.render('folders/file-detail', { title: 'File Details', file });
};

exports.downloadFile = async (req, res) => {
  const file = await req.prisma.fileRecord.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user.id,
    },
  });

  if (!file) return res.status(404).render('notFound', { title: 'File not found' });

  const absolutePath = path.join(__dirname, '..', 'uploads', String(file.folderId || 'general'), file.name);
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).render('notFound', { title: 'File not found on disk' });
  }

  res.download(absolutePath, file.originalName);
};
