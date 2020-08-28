const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, 'A post must have a name'],
    unique: true,
  },

  description: {
    type: String,
    require: [true, 'A post must have a description'],
    trim: true,
  },
  author: {
    type: String,
  },
  category: {
    type: String,
    required: [true, 'A post must have a category'],
    enum: {
      values: [
        'ScienceAndTech',
        'Sports',
        'FilmsAndSeries',
        'StartUp',
        'FoodAndTravel',
        'Women"sStory',
        'LGBTQ',
        'FunAnHumours',
        'BarakValley',
      ],
      message: 'no such category available!!!!!',
    },
    trim: true,
  },
  photoCover: {
    type: String,
    required: [true, 'A post must have a cover photo'],
  },
  photos: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;