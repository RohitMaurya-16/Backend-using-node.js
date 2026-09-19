exports.getDashboard = async (req, res) => {
  const [folderCount, fileCount] = await Promise.all([
    req.prisma.folder.count({ where: { userId: req.user.id } }),
    req.prisma.fileRecord.count({ where: { userId: req.user.id } }),
  ]);

  const folders = await req.prisma.folder.findMany({
    where: { userId: req.user.id },
    include: { files: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  res.render('dashboard', {
    title: 'Dashboard',
    folderCount,
    fileCount,
    folders,
  });
};
