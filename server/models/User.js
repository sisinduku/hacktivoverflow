const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connection.openUri(process.env.MONGO_URL_DEV)

let userSchema = new Schema({
  userID: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

userSchema.pre('update', function (next) {
  this.findOne({
      userID: this._conditions.userID
    })
    .then((user) => {
      this.updateOne({
          _id: user._id
        }, {
          lastLogin: Date.now()
        })
        .then(() => {
          next();
        })
        .catch((err) => {
          console.error(err);
        })
    })
})

module.exports = mongoose.model('User', userSchema);
