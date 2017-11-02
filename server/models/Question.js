const mongoose = require('mongoose');
const slug = require('slug')
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connection.openUri(process.env.MONGO_URL_DEV)

let questionSchema = new Schema({
  slug: {
    type: String,
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvoters: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvoters: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: null
  }
})

questionSchema.pre('save', function (next) {
  mongoose.models.Question
    .count({
      title: this.title
    })
    .then((count) => {
      console.log('jumlah', count);
      if (count > 0) {
        this.slug = slug(this.title + '-' + (parseInt(count) + 1), {
          lower: true
        });
      } else {
        this.slug = slug(this.title, {
          lower: true
        });
      }
      next()
    })
})

questionSchema.pre('update', function (next) {
  this.findOne({
      slug: this._condition.slug
    })
    .then((value) => {
      this.updateOne({
          slug: this._condition.slug
        }, {
          updatedAt: Date.now()
        })
        .then(() => {
          next()
        })
        .catch((err) => {
          console.error(err);
        })
    })
    .catch((err) => {
      console.error(err);
    })
})

module.exports = mongoose.model('Question', questionSchema);
