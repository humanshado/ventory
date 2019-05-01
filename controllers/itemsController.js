const express = require('express');
const router = express.Router();
const { Item } = require('../models/itemModel');

router.get('/add-item', (req, res) => res.render('items/new', { currentUser: req.user ? req.user.firstName : null }));

router.post('/add-item', (req, res) => {
  let item = new Item({
          title: req.body.title,
          status: req.body.status,
          description: req.body.description,
          category: req.body.category,
          entry_date: req.body.entry_date,
          condition: req.body.condition,
          brand: req.body.brand,
          location: req.body.location,
          quantity: req.body.quantity,
          list_price: req.body.list_price,
          payment_method: req.body.payment_method,
          ramount_received: req.body.amount_received,
          date_issued: req.body.date_issued,
          imageUrl: req.body.imageUrl
  });

  item.save().then(() => {
    res.redirect('/items');
  }).catch(err => console.log('New item creation failed', err));
});

router.get('/items', (req, res) => {
    console.log('current user in items controller ', req.user);
    console.log('Is user authenticated in items controller ', req.isAuthenticated());
    Item.find().then(items => {
      res.render('items', { items: items, currentUser: req.user ? req.user.firstName : null })
  }).catch(err => console.log('Fetching all items failed', err));
});

router.get('/show-item/:id', (req, res) => {
  const itemId = req.params.id;
  Item.findById(itemId).then(item => {
    res.render('items/show', { item: item, currentUser: req.user ? req.user.firstName : null })
  }).catch(err => console.log('Show item details failed', err));

});

module.exports = router;