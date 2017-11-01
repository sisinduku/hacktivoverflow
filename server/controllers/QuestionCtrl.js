const Question = require('../models/Question');

class QuestionCtrl {
  static getQuestions(req, res, next) {
    Question.aggregate({
        $project: {
          slug: 1,
          title: 1,
          content: 1,
          author: 1,
          upvotes: 1,
          downvotes: 1,
          createdAt: 1,
          updatedAt: 1,
          voted: {
            $cond: {
              if: {
                $in: [req.params.userID, "$upvotes"]
              },
              then: 'upvoted',
              else: {
                $cond: {
                  if: {
                    $in: [req.params.userID, "$downvotes"]
                  },
                  then: 'downvoted',
                  else: 'unvote'
                }
              }
            }
          },
          upvotesCount: {
            $size: "$upvotes"
          },
          downvotesCount: {
            $size: "$downvotes"
          }
        }
      })
      .then((questions) => {
        Question.populate(questions, [{
            path: "author"
          }, {
            path: "upvotes"
          }, {
            path: "downvotes"
          }])
          .then((questionsPopulated) => {
            res.status(200).json(questionsPopulated);
          })
      })
  }
}

module.exports = QuestionCtrl;
