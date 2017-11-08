const Answer = require('../models/Answer');
const mongoose = require('mongoose');

const queryAnswerById = (user, answerId) => {
  return [{
    $addFields: {
      voted: {
        $cond: {
          if: {
            $in: [mongoose.Types.ObjectId(user), "$upvoters"]
          },
          then: 'upvoted',
          else: {
            $cond: {
              if: {
                $in: [mongoose.Types.ObjectId(user), "$downvoters"]
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
      _id: mongoose.Types.ObjectId(answerId)
    }
  }]
}

class AnswerCtrl {

  static postAnswer(req, res, next) {
    Answer.create({
        content: req.body.content,
        question: req.body.question,
        author: req.body.author,
      })
      .then((answer) => {
        Answer.aggregate(queryAnswerById(req.body.author, answer._id))
          .then((queriedAnswer) => {
            Answer.populate(queriedAnswer, {
                path: 'author'
              })
              .then(populatedAnswer => {
                res.status(201)
                  .json(populatedAnswer[0]);
              })
              .catch((err) => {
                console.error(err);
              })
          })
          .catch((err) => {
            console.error(err);
          })
      })
      .catch((err) => {
        console.error(err);
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
          question: mongoose.Types.ObjectId(req.params.questionId)
        }
      }])
      .then((answers) => {
        Answer.populate(answers, {
            path: "author"
          })
          .then((answersPopulated) => {
            console.log(answersPopulated);
            res.status(200)
              .json(answersPopulated);
          })
      })
  }

  static getAnswer(req, res, next) {
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
          _id: mongoose.Types.ObjectId(req.params.answerId)
        }
      }])
      .then((answers) => {
        Answer.populate(answers, {
            path: "author"
          })
          .then((answersPopulated) => {
            console.log(answersPopulated);
            res.status(200)
              .json(answersPopulated[0]);
          })
      })
  }

  static upvoteAnswer(req, res, next) {
    Answer.findOneAndUpdate({
        _id: req.params.answerId
      }, {
        $push: {
          upvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((answer) => {
        Answer.aggregate(queryAnswerById(req.body.user, req.params.answerId))
          .then((queriedAnswer) => {
            Answer.populate(queriedAnswer, {
                path: 'author'
              })
              .then(populatedAnswer => {
                res.status(200)
                  .json(populatedAnswer[0])
              })
          })
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }

  static downvoteAnswer(req, res, next) {
    Answer.findOneAndUpdate({
        _id: req.params.answerId
      }, {
        $push: {
          downvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((answer) => {
        Answer.aggregate(queryAnswerById(req.body.user, req.params.answerId))
          .then((queriedAnswer) => {
            Answer.populate(queriedAnswer, {
                path: 'author'
              })
              .then(populatedAnswer => {
                res.status(200)
                  .json(populatedAnswer[0])
              })
          })
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }

  static unvoteAnswer(req, res, next) {
    Answer.findOneAndUpdate({
        _id: req.params.answerId
      }, {
        $pull: {
          downvoters: req.body.user,
          upvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((answer) => {
        Answer.aggregate(queryAnswerById(req.body.user, req.params.answerId))
          .then((queriedAnswer) => {
            Answer.populate(queriedAnswer, {
                path: 'author'
              })
              .then(populatedAnswer => {
                console.log(populatedAnswer[0]);
                res.status(200)
                  .json(populatedAnswer[0])
              })
          })
      })
      .catch((err) => {
        console.error('error ', err);
        res.status(400)
          .json(err);
      })
  }

  static updateAnswer(req, res, next) {
    Answer.findOneAndUpdate({
        _id: req.params.answerId
      }, {
        content: req.body.content,
        author: mongoose.Types.ObjectId(req.body.author)
      })
      .then((answer) => {
        Answer.aggregate(queryAnswerById(req.body.author, req.params.answerId))
          .then((queriedAnswer) => {
            Answer.populate(queriedAnswer, {
                path: 'author'
              })
              .then(populatedAnswer => {
                res.status(200)
                  .json(populatedAnswer[0])
              })
          })
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }

  static deleteAnswer(req, res, next) {
    Answer.findOneAndRemove({
        _id: req.params.answerId
      })
      .then(question => {
        Answer.aggregate(queryAnswerById(req.body.author, req.params.answerId))
          .then((queriedAnswer) => {
            Answer.populate(queriedAnswer, {
                path: 'author'
              })
              .then(populatedAnswer => {
                res.status(200)
                  .json(populatedAnswer[0])
              })
          })
      })
  }
}

module.exports = AnswerCtrl;
