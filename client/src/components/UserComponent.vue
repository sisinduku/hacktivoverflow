<template>
<div id='UserComponent' class="text-left">
  <b-btn v-b-modal="'modaluser'" size="sm">Add Question</b-btn>

  <!-- Modal Component -->
  <b-modal id="modaluser" ref="modaluser" title="User Action" @ok="handleOk" @shown="clearInput">
    <form @submit.stop.prevent="handleSubmit">
      <b-form-group label="Title:">
        <b-form-input type="text" placeholder="Questoin Title" v-model="title"></b-form-input>
      </b-form-group>
      <b-form-group label="Content:">
        <wysiwyg v-model="content" />
      </b-form-group>
    </form>
    <b-alert v-if="validation" show variant="danger">
      <ul v-html="validation"></ul>
    </b-alert>
  </b-modal>
</div>
</template>
<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'UserComponent',

  props: ['action'],

  data: () => ({
    title: '',
    content: '',
    validation: ''
  }),

  computed: {
    ...mapGetters(['user'])
  },

  methods: {
    ...mapActions(['postQuestion']),
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.validation = ''
      if (!this.title) {
        this.validation += '<li>Please enter question title</li>'
      }
      if (!this.content) {
        this.validation += '<li>Please enter content</li>'
      }
      if (this.content && this.title) {
        console.log('here')
        this.postQuestion({
          title: this.title,
          content: this.content,
          author: this.user._id
        })
        this.$refs.modaluser.hide()
        this.clearInput()
      }
    },
    clearInput () {
      this.title = ''
      this.content = ''
    }
  }
}
</script>
<style scoped>
</style>
