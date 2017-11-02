const Question = require('../models/Question');
const mongoose = require('mongoose');

class QuestionCtrl {
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
}

module.exports = QuestionCtrl;
