<template>
  <div id='QuestionDetailComponent'>
    <b-list-group>
      <b-list-group-item :key="question._id" class="text-justify">
        <h2>{{question.title}}</h2>
        <p v-html="question.content"></p>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
export default {
  name: 'QuestionDetailComponent',

  props: ['slug'],

  data: () => ({
    question: {}
  }),

  watch: {
    slug (newValue) {
      this.getQuestion()
    }
  },

  methods: {
    getQuestion () {
      this.$http.get(`/api/questions/get_question/${this.slug}`)
        .then(({data}) => {
          console.log(data)
          this.$set(this.question, '_id', data._id)
          this.$set(this.question, 'slug', data.slug)
          this.$set(this.question, 'title', data.title)
          this.$set(this.question, 'content', data.content)
          this.$set(this.question, 'author', data.author)
          this.$set(this.question, 'upvotes', data.upvotes)
          this.$set(this.question, 'downvotes', data.downvotes)
          this.$set(this.question, 'totalvotes', data.totalvotes)
          this.$set(this.question, 'voted', data.voted)
          this.$set(this.question, 'createdAt', data.createdAt)
          this.$set(this.question, 'updatedAt', data.updatedAt)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },

  created () {
    this.getQuestion()
  }
}
</script>
<style scoped>
</style>
