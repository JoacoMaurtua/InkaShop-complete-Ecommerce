const mongoose = require('mongoose');

//Esta es una entidad debil
const reviewSchema = new mongoose.Schema({
  name: {type: String, required: true},
  rating: {type: Number, required: true},
  comment: {type: String, required: true}
}, {timestamps:true});

const productSchema = new mongoose.Schema({

  //Relacion/anidamiento con esquema User
  user:{
    type: mongoose.Schema.Types.ObjectId,
    required: [true,'Este campo es obligatorio'],
    ref: 'User'
  },

  name:{
    type: String,
    required: [true,'Este campo es obligatorio']
  },

  image:{
    type: String,
    required: [true,'Este campo es obligatorio']
  },

  brand:{
    type: String,
    required: [true,'Este campo es obligatorio']
  },

  category:{
    type: String,
    required: [true,'Este campo es obligatorio']
  },

  description:{
    type: String,
    required: [true,'Este campo es obligatorio']
  },

  rating:{
    type: Number,
    required: [true,'Este campo es obligatorio'],
    default: 0
  },

  reviews: [reviewSchema],

  numReviews:{
    type:Number,
    required:true,
    default:0,
  },

  price:{
    type: Number,
    required: [true,'Este campo es obligatorio'],
    default: 0
  },

  countInStock:{
    type: Number,
    required: [true,'Este campo es obligatorio'],
    default: 0
  },


},{timestamps:true});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;