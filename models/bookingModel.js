const mongoose = require('mongoose');

const bookingShcema = new mongoose.Schema({
  tour: {
    type: mongoose.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must be belong to a Tour!']
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must be belong to a User!']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

bookingShcema.pre(/^find/, function(next) {
  this.populate('user').populate({ path: 'tour', select: 'name' });

  next();
});

module.exports = mongoose.model('Booking', bookingShcema);
