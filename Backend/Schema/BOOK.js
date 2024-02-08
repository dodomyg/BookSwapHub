const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  edition:{
    type: String,
    required: true,
  },
  category: {
    type: [String],
    required: true,
    enum: ['Fiction','Adventure', 'Non-Fiction', 'Science-Fiction', 'Mystery', 'Fantasy', 'Drama', 'Romance','Thriller','Kids' ,'Other'],
  },
  isbn: {
    type: String,
    required: true,
    unique:true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER',
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER',
    default: null,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  pic:{
    type: String,
    required:true
  }
});

module.exports = mongoose.model('BOOK', bookSchema);
