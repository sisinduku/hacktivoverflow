const Answer = require('../models/Answer');
const mongoose = require('mongoose');

class QuestionCtrl {

  static postAnswer(req, res, next) {
    Answer.create({
        author: req.body.user,
        content: req.body.content,
        author: req.body.author,
      })
      .then((answer) => {
        res.status(201)
          .json(answer);
      })
  }

  static getAnswerByQuestion(req, res, next) {
    Answer.aggregate([{
        $addFields: {
          voted: {
            $cond: {
              if: {
                $in: [mongoose.Types.ObjectId(req.params.user), "$upvoters"]
              },
              then: 'upvoted',
              else: {
                $cond: {
                  if: {
                    $in: [mongoose.Types.ObjectId(req.params.user), "$downvoters"]
                  },
                  then: 'downvoted',
                  else: 'unvote'
                }
              }
            }
          },
          upvotes: {
            $size: "$upvoters"
          },
          downvotes: {
            $size: "$downvoters"
          },
          totalvotes: {
            $subtract: [{
              $size: "$upvoters"
            }, {
              $size: "$downvoters"
            }]
          }
        }
      }, {
        $match: {
          question: req.params.question
        }
      }])
      .then((answers) => {
        Answer.populate(answers, {
            path: "author"
          })
          .then((answersPopulated) => {
            res.status(200)
              .json(answersPopulated);
          })
      })
  }

  static upvoteAnswer(req, res, next) {
    Answer.findOneAndUpdate({
        _id: req.body.answerId
      }, {
        $push: {
          upvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((answer) => {
        res.status(200)
          .json(answer);
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }

  static downvoteAnswer(req, res, next) {
    Answer.findOneAndUpdate({
        _id: req.body.answerId
      }, {
        $push: {
          downvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((answer) => {
        res.status(200)
          .json(answer);
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }

  static unvoteAnswer(req, res, next) {
    Answer.findOneAndUpdate({
        _id: req.body.answerId
      }, {
        $pull: {
          downvoters: req.body.user
        },
        $pull: {
          upvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((answer) => {
        res.status(200)
          .json(answer);
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }
}

module.exports = AnswerCtrl;
