// const multer = require('multer');
// const sharp = require('sharp');
/*eslint-disable*/
const express = require('express');

const Post = require('../models/postModel');

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Not an image! Please upload only images'), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// exports.uploadPostPhotos = upload.fields([{
//     name: 'photoCover',
//     maxCount: 1
//   },
//   {
//     name: 'photos',
//     maxCount: 3
//   }
// ]);

// exports.resizePostPhotos = async (req, res, next) => {

//   if (!req.files.photoCover) return next();

//   //1.CoverPhoto
//   req.body.photoCover = `${req.body.photoCoverName}-${Date.now()}.jpeg`;

//   await sharp(req.files.photoCover[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({
//     quality: 90
//   }).toFile(`img/${req.body.photoCover}`);

//   //Photos
//   if (!req.files.photos) return next();
//   req.body.photos = [];

//   await Promise.all(req.files.photos.map(async (file, i) => {
//     const filename = `post-${req.body.name}-${Date.now()}-${i+1}.jpeg`;

//     await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({
//       quality: 90
//     }).toFile(`img/${filename}`);

//     req.body.photos.push(filename);
//   }));
//   next();
// }
//exports.uploadPostImage = upload.single('image');

// exports.resizePostImage = async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `post-${req.body.name}-${Date.now()}-image.jpeg`;

//   await sharp(req.file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({
//     quality: 90
//   }).toFile(`img/${req.file.filename}`);
//   next();
// };

/* Google Drive API */
var formidable = require('formidable');
const fs = require('fs');
const {
  google
} = require('googleapis');
const readline = require('readline');

const SCOPES = [
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive',
];
const TOKEN_PATH = 'token.json';

/*Uploading notes to google drive */

function authorize(credentials, callback, next, fields, req, res) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      console.log(err);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, next, fields, req, res);
  });
}

var fileID;
var filePath;
async function uploadImage(auth, next, fields, req, res) {
  const drive = google.drive({
    version: 'v3',
    auth
  });
  const fileMetadata = {
    name: fields.title + '.jpg',
    parents: ['1KyD6eFLO8PejPhuUnboYoboyDFK__Sr6'],
  };
  const media = {
    mimeType: 'image/jpg',
    body: fs.createReadStream(filePath),
  };

  console.log('IN UPLOAD FILE');
  try {
    console.log('IN UPLOAD FILE 1');
    var file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log('IN UPLOAD FILE 2');
    fileID = file.data.id;
    var imageLink = 'https://drive.google.com/uc?export=view&id=' + fileID;

    console.log(imageLink);
    console.log(fields);

    var date = new Date();

    var newPost = new Object();

    // newPost.title = fields.title;
    // newPost.link = imageLink;
    // newPost.category = fields.category;
    // newPost.description = fields.description;
    // newPost.author = fields.author;
    // newPost.createdAt = date.toDateString();

    var newPost = await new Post({
      title: fields.title,
      photoCover: imageLink,
      category: fields.category,
      description: fields.description,
      author: fields.author,
      createdAt: date.toDateString(),
    });

    newPost.save(function (err, post) {
      if (err) return console.log(err);
      console.log(post);
    });
  } catch (err) {
    console.log(err);
  }
}

exports.fun1 = (req, res, next) => {
  console.log('In fun1');
  const form = formidable({
    multiples: true,
  });

  form.parse(req, function (err, fields, files) {
    if (err) console.log(err);

    filePath = files.note.path;

    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      authorize(JSON.parse(content), uploadImage, next, fields, req, res);
    });
  });
  res.redirect('/admin-panel');
};

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
};

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
    //const newPost = await Post.create(newPost);
    res.redirect('/admin-panel');
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