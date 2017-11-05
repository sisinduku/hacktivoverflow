<template>
  <div id='QuestionsSummaryComponent'>
    <b-list-group>
      <b-list-group-item v-for="question in questions" :key="question._id" class="text-left">
        <h2>{{question.title}}</h2>
        <p>{{formatSummary(question.content)}}</p>
        <b-button size="sm" variant="primary" :to="{name: 'detail', params: {id: question._id}}">
          Read More
        </b-button>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import striptags from 'striptags'
export default {
  name: 'QuestionsSummaryComponent',

  props: ['questions'],

  data: () => ({}),

  methods: {
    formatSummary (value) {
      let striped = striptags(value)
      if (striped.length > 200) {
        let stripedCut = striped.substring(0, 200)
        striped = stripedCut.substring(0, striped.indexOf(' ')) + '...'
      }
      return striped
    }
  }
}
</script>
<style scoped>
</style>
