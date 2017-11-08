<template>
  <div id='AnswerListComponent'>
    <b-list-group style="padding-top: 5px">
      <b-list-group-item v-for="(answer, index) in sortedAnswers" :key="question._id" class="text-left">
        <p v-html="answer.content"></p>
        <small>Created by: {{answer.author.name}} on: {{dateFormat(answer.createdAt)}}</small>
        <b-row style="padding-top: 5px">
          <b-col>
            <b-button v-if="isLogin" size="sm" variant="primary" @click="upVote(answer._id)">
              <span class="fa fa-thumbs-up">{{answer.upvotes}}</span>
            </b-button>
            <b-button v-if="isLogin" size="sm" variant="danger" @click="downVote(answer._id)">
              <span class="fa fa-thumbs-down">{{answer.downvotes}}</span>
            </b-button>
            <b-button v-if="isLogin && answer.author.userID === user.userID" size="sm" variant="info" :to="{name: 'edit_answer', params: {id: answer._id}}">
              <span class="fa fa-edit"></span>Edit
            </b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'AnswerListComponent',

  props: ['question'],

  data: () => ({}),

  computed: {
    sortedAnswers () {
      return _.sortBy(this.answers, ['totalvotes']).reverse()
    },
    ...mapState(['isLogin', 'user', 'answers'])
  },

  methods: {
    ...mapActions(['getAnswers', 'upvoteAns', 'downvoteAns', 'unvoteAns']),
    dateFormat (date) {
      return moment(date).format('D MMM YYYY')
    },
    getThisAnswers (questionId) {
      this.getAnswers(questionId)
        .then((answers) => {
          this.answers = answers
        })
        .catch((err) => {
          console.error(err)
        })
    },
    upVote (answerId) {
      let idx = this.answers.findIndex(answer => answer._id === answerId)
      if (this.answers[idx].voted !== 'upvoted') {
        if (this.answers[idx].voted === 'unvote') {
          this.upvoteAns({
            answerId: answerId
          })
        } else {
          this.unvoteAns({
            answerId: answerId
          })
            .then(() => {
              this.upvoteAns({
                answerId: answerId
              })
            })
        }
      } else {
        this.unvoteAns({
          answerId: answerId
        })
      }
    },
    downVote (answerId) {
      let idx = this.answers.findIndex(answer => answer._id === answerId)
      if (this.answers[idx].voted !== 'downvoted') {
        if (this.answers[idx].voted === 'unvote') {
          this.downvoteAns({
            answerId: answerId
          })
        } else {
          this.unvoteAns({
            answerId: answerId
          })
            .then(() => {
              this.downvoteAns({
                answerId: answerId
              })
            })
        }
      } else {
        this.unvoteAns({
          answerId: answerId
        })
      }
    }
  },

  created () {
    this.getAnswers(this.question._id)
  }
}
</script>
<style scoped>
</style>
