const mongoose = require('mongoose');

const reviewShcema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    ratting: {
      type: Number,
      min: [1, 'Review must be above 1.0'],
      max: [5, 'Review must be below 5.0']
    },
    createdAt: { type: Date, default: Date.now() },
    tour: {
      type: mongoose.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewShcema.pre(/^find/, function populateTourAndUser(next) {
  this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

module.exports = mongoose.model('Review', reviewShcema);
