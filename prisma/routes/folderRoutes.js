const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

function ensureAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  next();
}

router.use(ensureAuth);

router.get('/', folderController.listFolders);
router.get('/new', folderController.getCreateFolder);
router.post('/new', folderController.postCreateFolder);
router.get('/:id', folderController.viewFolder);
router.get('/:id/edit', folderController.getEditFolder);
router.put('/:id', folderController.updateFolder);
router.delete('/:id', folderController.deleteFolder);

module.exports = router;
