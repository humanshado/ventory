const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/itemsController');

router.get('/add-item', itemsController.getNewItemForm);
router.post('/add-item', itemsController.postNewItem);

module.exports = router;