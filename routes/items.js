var express = require('express');
var router = express.Router();

const itemsController = require('../controllers/itemsController');

router.get('/show-item/:id', itemsController.showItemDetails);
router.get('/add-item', itemsController.getNewItemForm);
router.post('/add-item', itemsController.postNewItem);
router.get('/', itemsController.fetchAllItems);

module.exports = router;
