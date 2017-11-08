<template>
<b-list-group id='UpdateAnswerComponent'>
  <b-list-group-item class="text-left">
    <form>
      <b-form-group label="Content:">
        <wysiwyg v-model="answer.content" />
      </b-form-group>
    </form>
    <b-button size="sm" variant="info" @click="updateNow">
      Update
    </b-button>
    <b-alert v-if="success" show variant="success">
      <ul>Answer Updated</ul>
    </b-alert>
  </b-list-group-item>
</b-list-group>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'UpdateAnswerComponent',

  data: () => ({
    answer: {},
    success: false
  }),

  computed: {
    ...mapGetters(['user'])
  },

  props: ['id'],

  methods: {
    ...mapActions(['updateAnswer']),
    updateNow () {
      this.updateAnswer({
        content: this.answer.content,
        author: this.user._id,
        answerId: this.id
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
    this.$http.get(`/api/answers/get_answer/${this.user._id}/${this.id}`)
      .then(({
        data
      }) => {
        this.answer = data
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
</script>
<style scoped>
</style>
