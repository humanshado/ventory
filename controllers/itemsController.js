const path = require('path');
const Item = require('../models/itemModel');

exports.getNewItemForm = (req, res) => {
  res.render('newForm', {
                  SKU: 'skur434rr',
                  client_code: 'cc43469837'
                 });
}

exports.postNewItem = (req, res) => {
  const item = new Item(
          req.body.title,
          req.body.status,
          req.body.description,
          req.body.category,
          req.body.entry_date,
          req.body.condition,
          req.body.brand,
          req.body.location,
          req.body.quantity,
          req.body.list_price,
          req.body.payment_method,
          req.body.amount_received,
          req.body.date_issued,
          req.body.images
  );

  Item.saveItem(item);
  res.redirect('/');

}

exports.fetchAllItems = (req, res) => {
  Item.fetchAllItems(items => {
    console.log('items: ', items);
    res.render('itemsList', { items: items })
  });
}