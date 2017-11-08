<template>
  <div id='QuestionDetailComponent'>
    <b-list-group>
      <b-list-group-item class="text-justify">
        <b-row>
          <b-col>
            <h2>{{question.title}}</h2>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p v-html="question.content"></p>
          </b-col>
        </b-row>
        <b-row style="padding-bottom: 5px">
          <b-col>
            <b-img thumbnail fluid :src="question.author.profilePic" alt="Thumbnail" size="sm" />
            <small>Created by: {{question.author.name}} on: {{dateFormat}}</small>
          </b-col>
        </b-row>
        <ActionComponent :question="question"></ActionComponent>
        <b-row style="padding-top: 5px" class="text-left">
          <b-col>
            <b-btn v-if="isLogin" v-b-modal="'modalanswer'" size="sm">
              <span class="fa fa-reply"></span> Add Answer
            </b-btn>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>

    <AnswerListComponent :question="question"></AnswerListComponent>

    <!-- Modal Component -->
    <b-modal id="modalanswer" ref="modalanswer" title="Give Answer" @ok="handleOk" @shown="clearInput">
      <form>
        <b-form-group>
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
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import ActionComponent from './ActionComponent.vue'
import AnswerListComponent from './AnswerListComponent.vue'
export default {
  name: 'QuestionDetailComponent',

  components: {
    ActionComponent,
    AnswerListComponent
  },

  props: ['slug'],

  data: () => ({
    content: '',
    validation: ''
  }),

  computed: {
    question () {
      return this.$store.getters.question(this.slug)
    },
    ...mapState([
      'isLogin', 'user'
    ]),
    dateFormat () {
      return moment(this.question.createdAt).format('D MMM YYYY')
    }
  },

  methods: {
    ...mapActions(['postAnswer']),
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.validation = ''
      if (!this.content) {
        this.validation += '<li>Please enter content</li>'
      } else {
        this.handlePost()
      }
    },
    handlePost () {
      this.postAnswer({
        content: this.content,
        question: this.question,
        author: this.user._id
      })
      this.$refs.modalanswer.hide()
      this.clearInput()
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
