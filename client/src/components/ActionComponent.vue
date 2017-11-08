<template>
  <b-row id='ActionTemplate' no-gutters style="padding-top: 5px">
    <b-col>
      <b-button v-if="isLogin" size="sm" variant="primary" @click="upVote(question._id)">
        <span class="fa fa-thumbs-up">{{question.upvotes}}</span>
      </b-button>
      <b-button v-if="isLogin" size="sm" variant="danger" @click="downVote(question._id)">
        <span class="fa fa-thumbs-down">{{question.downvotes}}</span>
      </b-button>
      <b-button v-if="isLogin && question.author.userID === user.userID" size="sm" variant="info" :to="{name: 'edit_question', params: {slug: question.slug}}">
        <span class="fa fa-edit"></span> Edit
      </b-button>
      <b-button v-if="isLogin && question.author.userID === user.userID" @click="deleteThisQuestion(question._id)" size="sm" variant="danger">
        <span class="fa fa-remove"></span> Delete
      </b-button>
    </b-col>
  </b-row>
</template>
<script>
import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'
export default {
  name: 'ActionTemplate',

  props: ['question'],

  computed: {
    ...mapState([
      'isLogin'
    ]),
    ...mapGetters([
      'questions',
      'user'
    ])
  },

  data: () => ({}),

  methods: {
    ...mapActions(['upvote', 'downvote', 'unvote', 'updateQuestion', 'deleteQuestion']),
    ...mapMutations(['currentQuestion', 'toggleEdit']),
    upVote (id) {
      let idx = this.questions.findIndex(question => question._id === id)
      if (this.questions[idx].voted !== 'upvoted') {
        if (this.questions[idx].voted === 'unvote') {
          this.upvote({
            questionId: id
          })
        } else {
          this.unvote({
            questionId: id
          })
            .then(() => {
              this.upvote({
                questionId: id
              })
            })
        }
      } else {
        this.unvote({
          questionId: id
        })
      }
    },
    downVote (id) {
      console.log('upvote ', id)
      let idx = this.questions.findIndex(question => question._id === id)
      if (this.questions[idx].voted !== 'downvoted') {
        if (this.questions[idx].voted === 'unvote') {
          this.downvote({
            questionId: id
          })
        } else {
          this.unvote({
            questionId: id
          })
            .then(() => {
              this.downvote({
                questionId: id
              })
            })
        }
      } else {
        this.unvote({
          questionId: id
        })
      }
    },
    showEdit () {
      this.currentQuestion(this.question)
      this.toggleEdit()
    },
    deleteThisQuestion (id) {
      this.deleteQuestion({
        questionId: id,
        author: this.user._id
      })
    }
  }
}
</script>
<style scoped>
</style>
