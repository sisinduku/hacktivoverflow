<template>
  <div id='AnswerListComponent'>
    <b-list-group style="padding-top: 5px">
      <b-list-group-item v-for="(answer, index) in sortedAnswers" :key="question._id" class="text-left">
        <p v-html="answer.content"></p>
        <small>Created by: {{answer.author.name}}</small>
        <b-row style="padding-top: 5px">
          <b-col>
            <b-button v-if="isLogin" size="sm" variant="secondary">
              <span class="fa fa-reply"></span> Voting
            </b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import _ from 'lodash'

export default {
  name: 'AnswerListComponent',

  props: ['question'],

  data: () => ({
    answers: {}
  }),

  computed: {
    sortedAnswers () {
      return _.sortBy(this.answers, ['totalvotes']).reverse()
    },
    ...mapState(['isLogin'])
  },

  methods: {
    ...mapActions(['getAnswers']),
    getThisAnswers (questionId) {
      this.getAnswers(questionId)
        .then((answers) => {
          this.answers = answers
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },

  created () {
    this.getThisAnswers(this.question._id)
  }
}
</script>
<style scoped>
</style>
