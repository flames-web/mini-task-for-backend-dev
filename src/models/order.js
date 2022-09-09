const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cart: {
      totalQty: {
        type: Number,
        default: 0,
        required: true,
      },
      totalCost: {
        type: Number,
        default: 0,
        required: true,
      },
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Item",
          },
          qty: {
            type: Number,
            default: 0,
          },
          price: {
            type: Number,
            default: 0,
          },
          name: {
            type: String,
          },
        },
      ],
    },
    address: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    Delivered: {
      type: Boolean,
      default: false,
    },
})