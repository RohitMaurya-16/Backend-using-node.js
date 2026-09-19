const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.listItems);
router.get('/create', itemController.createItemGet);
router.post('/create', itemController.createItemPost);
router.get('/:id', itemController.itemDetail);
router.get('/:id/update', itemController.updateItemGet);
router.post('/:id/update', itemController.updateItemPost);
router.post('/:id/delete', itemController.deleteItem);

module.exports = router;
