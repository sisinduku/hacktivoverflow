const Question = require('../models/Question');
const mongoose = require('mongoose');

const queryQuestionById = (user, questionId) => {
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
      _id: mongoose.Types.ObjectId(questionId)
    }
  }]
}

class QuestionCtrl {
  static postQuestion(req, res, next) {
    console.log(req.body);
    Question.create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
      })
      .then((question) => {
        Question.aggregate(queryQuestionById(req.body.author, question._id))
          .then((queriedQuestion) => {
            Question.populate(queriedQuestion, {
                path: 'author'
              })
              .then(populatedQuestion => {
                res.status(200)
                  .json(populatedQuestion[0])
              })
          })
      })
  }

  static getQuestions(req, res, next) {
    Question.aggregate([{
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
        $sort: {
          totalvotes: -1
        }
      }])
      .then((questions) => {
        Question.populate(questions, {
            path: "author"
          })
          .then((questionsPopulated) => {
            res.status(200)
              .json(questionsPopulated);
          })
      })
  }

  static getQuestionBySlug(req, res, next) {
    Question.aggregate([{
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
          slug: req.params.slug
        }
      }])
      .then((question) => {
        Question.populate(question, {
            path: "author"
          })
          .then((questionPopulated) => {
            res.status(200)
              .json(questionPopulated[0]);
          })
      })
  }

  static upvoteQuestion(req, res, next) {
    Question.findOneAndUpdate({
        _id: req.params.questionId
      }, {
        $push: {
          upvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((question) => {
        Question.aggregate(queryQuestionById(req.body.user, req.params.questionId))
          .then((queriedQuestion) => {
            Question.populate(queriedQuestion, {
                path: 'author'
              })
              .then(populatedQuestion => {
                res.status(200)
                  .json(populatedQuestion[0])
              })
          })
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }

  static downvoteQuestion(req, res, next) {
    Question.findOneAndUpdate({
        _id: req.params.questionId
      }, {
        $push: {
          downvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((question) => {
        Question.aggregate(queryQuestionById(req.body.user, req.params.questionId))
          .then((queriedQuestion) => {
            Question.populate(queriedQuestion, {
                path: 'author'
              })
              .then(populatedQuestion => {
                res.status(200)
                  .json(populatedQuestion[0])
              })
          })
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }

  static unvoteQuestion(req, res, next) {
    Question.findOneAndUpdate({
        _id: req.params.questionId
      }, {
        $pull: {
          downvoters: req.body.user,
          upvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((question) => {
        Question.aggregate(queryQuestionById(req.body.user, req.params.questionId))
          .then((queriedQuestion) => {
            Question.populate(queriedQuestion, {
                path: 'author'
              })
              .then(populatedQuestion => {
                res.status(200)
                  .json(populatedQuestion[0])
              })
          })
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }

  static updateQuestion(req, res, next) {
    Question.findOneAndUpdate({
        _id: req.params.questionId
      }, {
        title: req.body.title,
        content: req.body.content,
        author: mongoose.Types.ObjectId(req.body.author)
      })
      .then((question) => {
        Question.aggregate(queryQuestionById(req.body.author, req.params.questionId))
          .then((queriedQuestion) => {
            Question.populate(queriedQuestion, {
                path: 'author'
              })
              .then(populatedQuestion => {
                res.status(200)
                  .json(populatedQuestion[0])
              })
          })
      })
      .catch((err) => {
        console.error(err);
        res.status(400)
          .json(err);
      })
  }

  static deleteQuestion(req, res, next) {
    Question.findOneAndRemove({
        _id: req.params.answerId
      })
      .then(question => {
        Question.aggregate(queryAnswerById(req.body.author, req.params.questionId))
          .then((queriedQuestin) => {
            Question.populate(queriedQuestin, {
                path: 'author'
              })
              .then(populatedQuestion => {
                res.status(200)
                  .json(populatedQuestion[0])
              })
          })
      })
  }
}

module.exports = QuestionCtrl;
