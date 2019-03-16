const fs = require('fs');
const path = require('path');

const items = [
  {
    title: 'Book One',
    status: 'available',
    description: 'bla bla bla',
    category: 'science',
    entry_date: '2019-03-13',
    condition: 'used',
    brand: 'Comic',
    location: 's003',
    quantity: '34',
    list_price: '56',
    payment_method: 'wire_transfer',
    amount_received: '25',
    date_issued: '2019-03-29'
  },
  {
    title: 'Book Two',
    status: 'sold',
    description: 'cha cha cha',
    category: 'business',
    entry_date: '2018-12-25',
    condition: 'new',
    brand: 'Romance',
    location: 's001',
    quantity: '19',
    list_price: '78',
    payment_method: 'paypal',
    amount_received: '0',
    date_issued: '2019-01-01'
  }

];

module.exports = class Item {

  //constructor
  constructor(
      title,
      status,
      description,
      category,
      entry_date,
      condition,
      brand,
      location,
      quantity,
      list_price,
      payment_method,
      amount_received,
      date_issued,
      images
  ) {
            this.title = title;
            this.status = status;
            this.description = description;
            this.category = category;
            this.entry_date = entry_date;
            this.condition = condition;
            this.brand = brand;
            this.location = location;
            this.quantity = quantity;
            this.list_price = list_price;
            this.payment_method = payment_method;
            this.amount_received = amount_received;
            this.date_issued = date_issued;
            this.images = images;
    }

  static fetchAllItems(cb){
    cb(items);
  }

  static saveItem(item){
    items.push(item);
  }

}