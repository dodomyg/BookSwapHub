const mongoose = require("mongoose");
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
  edition: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
    required: true,
    enum: [
      "Fiction",
      "Adventure",
      "Education",
      "Non-Fiction",
      "Science-Fiction",
      "Mystery",
      "Fantasy",
      "Drama",
      "Romance",
      "Thriller",
      "Kids",
      "Other",
    ],
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  ratings: {
    type: Number,
    default: 0,
    max: 5,
    min: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  holder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    default: null,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  requester: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "USER",
    default: [],
  },
  desc: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
  frontPage: {
    type: String,
    required: true,
  },
  backPage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BOOK", bookSchema);
