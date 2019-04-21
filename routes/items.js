const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/itemsController');

router.get('/show-item/:id', itemsController.showItemDetails);
router.get('/add-item', itemsController.getNewItemForm);
router.post('/add-item', itemsController.postNewItem);
router.get('/items', itemsController.fetchAllItems);

module.exports = router;
