const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price,';
  req.query.fields = 'name,ratingsAverage,price,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFileds()
      .paginate();

    // Execute query
    const tours = await features.query;

    // Send response
    res
      .status(200)
      .json({ status: 'success', results: tours.length, data: { tours } });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  const tourId = req.params.id;
  try {
    const tour = await Tour.findById(tourId);
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // await newTour.save();

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const updatedTour = await Tour.findByIdAndUpdate(tourId, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: { tour: updatedTour } });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Can"t update tour now!'
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    await Tour.findByIdAndDelete(tourId);

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Can"t delete tour now!'
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          avgRating: { $avg: '$ratingsAverage' },
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { avgPrice: 1 } }
      // { $match: { _id: { $ne: 'EASY' } } }
    ]);
    res.status(200).json({ status: 'success', data: { stats } });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Can"t aggregate tours now!'
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);

    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: { _id: 0 }
      },
      { $sort: { numTourStarts: -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({ status: 'success', data: { plan } });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Can"t aggregate tours now!'
    });
  }
};
