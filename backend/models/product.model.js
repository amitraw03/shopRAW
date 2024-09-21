import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: [true, 'image is required'],
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true });

export const Product = mongoose.model('Product', productSchema);