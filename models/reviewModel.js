const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewShcema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
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

reviewShcema.index({ tour: 1, user: 1 }, { unique: true });

reviewShcema.statics.calcAverageRatings = async function calcAverageRatings(
  tourId
) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0
    });
  }
};

reviewShcema.post('save', function addReviewRatingOnTour() {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

reviewShcema.pre(/^findOneAnd/, async function hookReviewToQuery(next) {
  this.review = await this.findOne();

  next();
});

reviewShcema.post(/^findOneAnd/, async function populateTourAndUser() {
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

reviewShcema.pre(/^find/, function populateTourAndUser(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

module.exports = mongoose.model('Review', reviewShcema);
