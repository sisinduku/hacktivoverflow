<template>
<div id='QuestionsSummaryComponent'>
  <b-list-group>
    <b-list-group-item v-for="(question, index) in sortedQuestions" :key="question._id" class="text-left">
      <b-row>
        <b-col>
          <h2>{{question.title}}</h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <p>{{formatSummary(question.content)}}</p>
        </b-col>
      </b-row>
      <b-row style="padding-bottom: 5px">
        <b-col>
          <b-img thumbnail fluid :src="question.author.profilePic" alt="Thumbnail" size="sm" />
          <small>Created by: {{question.author.name}} on: {{dateFormat(question.createdAt)}}</small>
        </b-col>
      </b-row>
      <b-button size="sm" variant="primary" :to="{name: 'detail', params: {slug: question.slug}}">
        Read More
      </b-button>
      <ActionComponent :question="question"></ActionComponent>
    </b-list-group-item>
  </b-list-group>
</div>
</template>
<script>
import striptags from 'striptags'
import moment from 'moment'
import {
  mapState,
  mapGetters
} from 'vuex'
import ActionComponent from './ActionComponent.vue'
export default {
  name: 'QuestionsSummaryComponent',

  components: {
    ActionComponent
  },

  computed: {
    ...mapState([
      'isLogin'
    ]),
    ...mapGetters([
      'sortedQuestions',
      'user'
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
    dateFormat (date) {
      return moment(date).format('D MMM YYYY')
    }
  }
}
</script>
<style scoped>
button {
  cursor: pointer;
}
</style>
