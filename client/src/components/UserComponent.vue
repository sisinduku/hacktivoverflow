<template>
<div id='UserComponent' class="text-left">
  <b-btn v-b-modal="'modaluser'" size="sm">Add Question</b-btn>

  <!-- Modal Component -->
  <b-modal id="modaluser" ref="modaluser" title="User Action" @ok="handleOk" @shown="clearInput">
    <form>
      <b-form-group label="Title:" @submit.stop.prevent="handlePost">
        <b-form-input type="text" placeholder="Question Title" v-model="title"></b-form-input>
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
  mapGetters,
  mapState
} from 'vuex'

export default {
  name: 'UserComponent',

  props: ['action'],

  data: () => ({
    title: '',
    content: '',
    validation: '',
    modaledit: false,
    titleEdit: '',
    contentEdit: ''
  }),

  computed: {
    ...mapGetters(['user']),
    ...mapState(['showEdit', 'currentQuestion']),
    titleEditBind: {
      get: function () {
        return this.currentQuestion.title
      },
      set: function (newValue) {
        this.titleEdit = newValue
      }
    },
    contentEditBind: {
      get: function () {
        return this.currentQuestion.content
      },
      set: function (newValue) {
        this.contentEdit = newValue
      }
    }
  },

  methods: {
    ...mapActions(['postQuestion', 'updateQuestion']),
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
        this.handlePost()
      }
    },
    handlePost () {
      this.postQuestion({
        title: this.title,
        content: this.content,
        author: this.user._id
      })
      this.$refs.modaluser.hide()
      this.clearInput()
    },
    clearInput () {
      this.title = ''
      this.content = ''
    },
    handleOkUpdate (evt2) {
      // Prevent modal from closing
      evt2.preventDefault()
      console.log('SNII')
      this.validation = ''
      if (!this.titleEdit) {
        this.validation += '<li>Please enter question title</li>'
      }
      if (!this.contentEdit) {
        this.validation += '<li>Please enter content</li>'
      }
      if (this.contentEdit && this.titleEdit) {
        this.handleUpdate()
      }
    },
    handleUpdate () {
      this.updateQuestion({
        title: this.titleEdit,
        content: this.contentEdit,
        author: this.user._id,
        questionId: this.question._id
      })
      console.log('update')
      this.clearEditInput()
    },
    onHidden (evt) {
      this.validation = ''
      this.$store.commit('toggleEdit')
    },
    clearEditInput () {
      this.titleEditBind = ''
      this.contentEditBind = ''
    }
  }
}
</script>
<style scoped>
</style>
