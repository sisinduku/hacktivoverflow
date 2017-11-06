<template>
  <div id='QuestionsSummaryComponent'>
    <b-list-group>
      <b-list-group-item v-for="(question, index) in questions" :key="question._id" class="text-left">
        <h2>{{question.title}}</h2>
        <p>{{formatSummary(question.content)}}</p>
        <b-button size="sm" variant="primary" :to="{name: 'detail', params: {slug: question.slug}}">
          Read More
        </b-button>
        <b-button v-if="(question.voted === 'unvote' || question.voted === 'downvoted') && isLogin" size="sm" variant="primary" @click="upVote(question._id)">
          <span class="fa fa-thumbs-up"></span>
        </b-button>
        <b-button v-if="(question.voted === 'unvote' || question.voted === 'upvoted') && isLogin" size="sm" variant="danger" @clock="downVote(question._id)">
          <span class="fa fa-thumbs-down"></span>
        </b-button>
        <b-button v-if="isLogin && questions[index].author.userID === user.userID" size="sm" variant="info" @clock="downVote(question._id)">
          <span class="fa fa-edit"></span>Edit
        </b-button>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import striptags from 'striptags'
// import jwtDecode from 'jwt-decode'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'QuestionsSummaryComponent',
  computed: {
    ...mapState([
      'isLogin'
    ]),
    ...mapGetters([
      'user',
      'questions'
    ])
  },

  methods: {
    formatSummary (value) {
      let striped = striptags(value)
      if (striped.length > 200) {
        let stripedCut = striped.substring(0, 200)
        striped = stripedCut.substring(0, striped.indexOf(' ')) + '...'
      }
      return striped
    },
    upvote (id) {
      let idx = this.questions.findIndex(question => question._id === id)
      if (this.questions[idx].voted !== 'upvoted') {
        if (this.questions[idx].voted === 'unvote') {

        }
      }
    },
    downvote (id) {
      let idx = this.questions.findIndex(question => question._id === id)
      if (this.questions[idx].voted !== 'downvoted') {
        if (this.questions[idx].voted === 'unvote') {

        }
      }
    }
  }
}
</script>
<style scoped>
  button {
    cursor: pointer;
  }
</style>
