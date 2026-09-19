const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.listCategories);
router.get('/create', categoryController.createCategoryGet);
router.post('/create', categoryController.createCategoryPost);
router.get('/:id', categoryController.categoryDetail);
router.get('/:id/update', categoryController.updateCategoryGet);
router.post('/:id/update', categoryController.updateCategoryPost);
router.post('/:id/delete', categoryController.deleteCategory);

module.exports = router;
