const FB = require('fb');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

class UserCtrl {
  static getAuthenticate(req, res, next) {
    console.log(req.headers.accesstoken);
    let fb = new FB.Facebook({
      accessToken: req.headers.accesstoken,
      appId: process.env.FBAPPID,
      appSecret: process.env.FBAPPSECRET
    })

    fb.api(req.headers.userid, {
      fields: ['id', 'name', 'email', 'picture']
    }, function (result) {
      console.log(result);
      User.findOneAndUpdate({
          userID: req.headers.userid
        }, {
          userID: result.id,
          name: result.name,
          email: result.email,
          profilePic: result.picture.data.url,
          lastLogin: new Date()
        }, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        })
        .then((user) => {
          let token = jwt.sign({
            _id: user._id,
            userID: result.id,
            name: result.name,
            email: result.email
          }, process.env.THIS_SECRET)

          res.status(200)
            .json({
              token: token,
              _id: user._id,
              userID: result.id,
              name: result.name,
              email: result.email,
              profilePic: result.picture.data.url,
              lastLogin: (user) ? user.lastLogin : null
            });
        })
    })
  }
}

module.exports = UserCtrl;
