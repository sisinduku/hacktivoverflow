<template>
<b-list-group id='UpdateQuestionComponent'>
  <b-list-group-item class="text-left">
    <form>
      <b-form-group label="Title:" @submit.stop.prevent="handleUpdate">
        <b-form-input type="text" placeholder="Question Title" v-model="question.title"></b-form-input>
      </b-form-group>
      <b-form-group label="Content:">
        <wysiwyg v-model="question.content" />
      </b-form-group>
    </form>
    <b-button size="sm" variant="info" @click="updateNow">
      Update
    </b-button>
    <b-alert v-if="success" show variant="success">
      <ul>Question Updated</ul>
    </b-alert>
  </b-list-group-item>
</b-list-group>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'UpdateQuestionComponent',

  data: () => ({
    question: {},
    success: false
  }),

  computed: {
    ...mapGetters(['user'])
  },

  props: ['slug'],

  methods: {
    ...mapActions(['updateQuestion']),
    updateNow () {
      this.updateQuestion({
        title: this.question.title,
        content: this.question.content,
        author: this.user._id,
        questionId: this.question._id
      })
        .then(() => {
          this.success = true
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },

  created () {
    this.$http.get(`/api/questions/get_question/${this.slug}`)
      .then(({
        data
      }) => {
        this.question = data
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
</script>
<style scoped>
</style>
