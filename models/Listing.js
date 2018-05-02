const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ListingSchema = new Schema({
    title:{
      type: String,
      require: true,
    },
    description:{
      type: String,
      required: true,
    },
    location:{
      type: String,
      required: true
    },
    price:{
      type: Number,
      required: true,
    },
    contact:{
      type: String,
      required: true
    },
    user:{
      type: Schema.Types.ObjectId,
      required:true,
    ref: 'User'
    },
  createdAt:{
    type: Date,
    required: true,
    default: Date.now,
  },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  
  });
  
  module.exports= Listing = mongoose.model('Listing', ListingSchema);