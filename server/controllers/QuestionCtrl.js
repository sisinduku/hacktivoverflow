const Question = require('../models/Question');
const mongoose = require('mongoose');

class QuestionCtrl {
  static postQuestion(req, res, next) {
    Question.create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
      })
      .then((question) => {
        res.status(201).json(question);
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
            res.status(200).json(questionsPopulated);
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
            res.status(200).json(questionPopulated[0]);
          })
      })
  }

  static upvoteQuestion(req, res, next) {
    Question.findOneAndUpdate({
        _id: req.body.questionId
      }, {
        $push: {
          upvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((question) => {
        res.status(200).json(question);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      })
  }

  static downvoteQuestion(req, res, next) {
    Question.findOneAndUpdate({
        _id: req.body.questionId
      }, {
        $push: {
          downvoters: req.body.user
        }
      }, {
        new: true
      })
      .then((question) => {
        res.status(200).json(question);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      })
  }

  static unvoteQuestion(req, res, next) {
    Question.findOneAndUpdate({
        _id: req.body.questionId
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
      .then((question) => {
        res.status(200).json(question);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      })
  }
}

module.exports = QuestionCtrl;
