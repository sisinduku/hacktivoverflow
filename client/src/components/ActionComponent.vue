<template>
  <b-row id='ActionTemplate' no-gutters style="padding-top: 5px">
    <b-col>
      <b-button size="sm" variant="primary" @click="upVote(question._id)">
        <span class="fa fa-thumbs-up">{{question.upvotes}}</span>
      </b-button>
      <b-button size="sm" variant="danger" @click="downVote(question._id)">
        <span class="fa fa-thumbs-down">{{question.downvotes}}</span>
      </b-button>
      <b-button v-if="isLogin && question.author.userID === user.userID" size="sm" variant="info">
        <span class="fa fa-edit"></span>Edit
      </b-button>
    </b-col>
  </b-row>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex'
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
    ...mapActions(['upvote', 'downvote', 'unvote']),
    upVote (id) {
      let idx = this.questions.findIndex(question => question._id === id)
      if (this.questions[idx].voted !== 'upvoted') {
        if (this.questions[idx].voted === 'unvote') {
          console.log(this.questions[idx].voted)
          this.upvote({
            questionId: id
          })
        } else {
          console.log(this.questions[idx].voted)
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
        console.log(this.questions[idx].voted)
        this.unvote({
          questionId: id
        })
      }
    },
    downVote (id) {
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
        console.log('asd')
        this.unvote({
          questionId: id
        })
      }
    }
  }
}
</script>
<style scoped>
</style>
