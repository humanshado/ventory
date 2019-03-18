const path = require('path');
const { Item } = require('../models/itemModel');
//const uuid4 = require('uuid4');

exports.getNewItemForm = (req, res) => {
  res.render('newForm');
}

exports.postNewItem = async (req, res) => {
  let item = await new Item({
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

  await item.save().then(() => {
    res.redirect('/');
  }).catch(err => console.log('New item creation failed', err));
}

exports.fetchAllItems = async (req, res) => {
    await Item.find().then(items => {
    res.render('itemsList', { items: items })
  }).catch(err => console.log('Fetching items failed', err));
}

exports.showItemDetails = async (req, res) => {
  const itemId = req.params.id;
  Item.findById(itemId).then(item => {
    res.render('showItem', { item: item })
  }).catch(err => console.log('Show item details failed', err));

}