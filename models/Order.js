const mongoose = require("mongoose");
console.log("NEW ORDER MODEL LOADED");
const orderSchema = new mongoose.Schema({
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  customerCity: String,
  customerPin: String,

  cartItems: Array,

  totalItems: Number,
  subtotal: Number,
  deliveryCharge: Number,
  gstAmount: Number,
  totalAmount: Number,

  deliverySlot: String,
  paymentMethod: String,
  orderStatus: String,

  couponMessage: String,

  createdAt: String
},{
  timestamps:true
});

module.exports = mongoose.model("Order", orderSchema);