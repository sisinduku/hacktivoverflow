const Answer = require('../models/Answer');
const mongoose = require('mongoose');

class QuestionCtrl {

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
            res.status(200).json(answersPopulated);
          })
      })
  }
}

module.exports = QuestionCtrl;
