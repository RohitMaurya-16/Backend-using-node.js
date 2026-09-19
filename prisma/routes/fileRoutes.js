const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

function ensureAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  next();
}

router.use(ensureAuth);

router.get('/upload', fileController.getUploadForm);
router.post('/upload', fileController.uploadMiddleware, fileController.postUpload);
router.get('/:id', fileController.viewFile);
router.get('/:id/download', fileController.downloadFile);

module.exports = router;
