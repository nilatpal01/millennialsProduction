const multer = require('multer');
const sharp = require('sharp');
const Post = require('../models/postModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPostPhotos = upload.fields([{
    name: 'photoCover',
    maxCount: 1
  },
  {
    name: 'photos',
    maxCount: 3
  }
]);


exports.resizePostPhotos = async (req, res, next) => {

  if (!req.files.photoCover) return next();

  //1.CoverPhoto
  req.body.photoCover = `${req.body.photoCoverName}-${Date.now()}.jpeg`;

  await sharp(req.files.photoCover[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({
    quality: 90
  }).toFile(`img/${req.body.photoCover}`);

  //Photos
  if (!req.files.photos) return next();
  req.body.photos = [];

  await Promise.all(req.files.photos.map(async (file, i) => {
    const filename = `post-${req.body.name}-${Date.now()}-${i+1}.jpeg`;

    await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({
      quality: 90
    }).toFile(`img/${filename}`);

    req.body.photos.push(filename);
  }));
  next();
}
//exports.uploadPostImage = upload.single('image');

// exports.resizePostImage = async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `post-${req.body.name}-${Date.now()}-image.jpeg`;

//   await sharp(req.file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({
//     quality: 90
//   }).toFile(`img/${req.file.filename}`);
//   next();
// };


exports.getSciAndTech = (req, res, next) => {
  req.query.category = 'ScienceAndTech';
  next();
};

exports.getSports = (req, res, next) => {
  req.query.category = 'Sports';
  next();
};

exports.getFilmsAndSeries = (req, res, next) => {
  req.query.category = 'FilmsAndSeries';
  next();
};

exports.getStartUp = (req, res, next) => {
  req.query.category = 'StartUp';
  next();
};

exports.getFoodAndTravel = (req, res, next) => {
  req.query.category = 'FoodAndTravel';
  next();
};

exports.getWomensStory = (req, res, next) => {
  req.query.category = 'Women"sStory';
  next();
};

exports.getLGBTQ = (req, res, next) => {
  req.query.category = 'LGBTQ';
  next();
};

exports.getFunAnHumours = (req, res, next) => {
  req.query.category = 'FunAnHumours';
  next();
};

exports.getBarakValley = (req, res, next) => {
  req.query.category = 'BarakValley';
  next();
}

exports.getallPost = async (req, res) => {
  try {
    //BUILD QUERY
    const queryObj = {
      ...req.query,
    };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    let query = Post.find(queryObj);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    //pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;

    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    //EXECUTE QUERY
    const post = await query.select('-__v');

    // if (req.query.page) {
    //   const numPost = await Post.countDocuments();
    //   if (skip >= numPost) throw new Error('This page does not exist');
    // }

    //SEND RESPONSE
    res.status(200).json({
      status: 'Success',
      results: post.length,
      data: {
        post: post,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid request',
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    // if (req.files) {
    //   req.body.image = req.file.filename;
    // }
    const newPost = await Post.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        post: newPost,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getOnePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select('-__v');
    res.status(200).json({
      status: 'success',
      data: {
        post: post,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid request',
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    // if (req.file) {
    //   req.file.filename = `post-${req.params.id}-${Date.now()}-image.jpeg`;
    //   req.body.image = req.file.filename;
    // }
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-__v');
    res.status(200).json({
      status: 'Success',
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};