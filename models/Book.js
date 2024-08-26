import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  status: {
    type: String,
    enum: ['to-be-read', 'currently-reading', 'read'],
    default: 'to-be-read'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Book = mongoose.model('Book', BookSchema)
export default Book
