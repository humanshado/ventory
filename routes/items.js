var express = require('express');
var router = express.Router();

const itemsController = require('../controllers/itemsController');

router.get('/', itemsController.fetchAllItems);
router.get('/show-item/:id', itemsController.showItemDetails);

module.exports = router;
