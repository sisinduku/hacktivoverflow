import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import _ from 'lodash'

const http = axios.create({
  baseURL: 'http://localhost:3000'
})
Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,

  state: {
    questions: [],
    currentQuestion: {},
    user: {
      userID: ''
    },
    isLogin: false,
    showEdit: false
  },

  getters: {
    questions: state => state.questions,
    user: state => state.user,
    sortedQuestions: state => _.sortBy(state.questions, ['totalvotes'])
      .reverse(),
    question: state => (slug) => {
      let question = state.questions.filter(question =>
        question.slug === slug
      )
      return question[0]
    }
  },

  mutations: {
    currentQuestion: (state, payload) => {
      state.currentQuestion = Object.assign({}, state.currentQuestion, payload)
    },
    setQuestions: (state, payload) => {
      state.questions = payload
    },
    addQuestion: (state, payload) => {
      state.questions.push(payload)
    },
    updateQuestion: (state, payload) => {
      let idx = state.questions.findIndex(question =>
        question._id === payload.question._id
      )
      state.questions.splice(idx, 1, payload.question)
    },
    setUser: (state, payload) => {
      const token = window.localStorage.getItem('token')
      if (token) {
        const decodedUser = jwtDecode(token)
        state.isLogin = true
        state.user = decodedUser
      }
    },
    logout: (state, payload) => {
      state.isLogin = false
      state.user = Object.assign({}, state.user, {
        userID: ''
      })
    },
    toggleEdit: (state, payload) => {
      state.showEdit = !state.showEdit
    }
  },

  actions: {
    getAllQuestions: (context, payload) => {
      let id = ''
      if (context.state.isLogin) {
        id = context.state.user._id
      }
      http.get(`/api/questions/get_questions/${id}`)
        .then(({
          data
        }) => {
          context.commit('setQuestions', data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    getAnswers: (context, payload) => {
      return new Promise(function (resolve, reject) {
        let id = ''
        if (context.state.isLogin) {
          id = context.state.user._id
        }
        http.get(`/api/answers/get_answers/${id}/${payload}`)
          .then(({
            data
          }) => {
            resolve(data)
          })
          .catch((err) => {
            console.error(err)
            reject(err)
          })
      })
    },
    postQuestion: (context, payload) => {
      http.post(`/api/questions/post_question`, {
        title: payload.title,
        content: payload.content,
        author: payload.author
      })
        .then(({
          data
        }) => {
          context.commit('addQuestion', data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    updateQuestion: (context, payload) => {
      return new Promise(function (resolve, reject) {
        http.post(`/api/questions/update_question/${payload.questionId}`, {
          title: payload.title,
          content: payload.content,
          author: payload.author
        })
          .then(({
            data
          }) => {
            context.commit('updateQuestion', {
              question: data
            })
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject(err)
          })
      })
    },
    getToken: (context, payload) => {
      http.post('/api/auth/get_authenticate', {}, {
        headers: {
          accesstoken: payload.authResponse.accessToken,
          userid: payload.authResponse.userID
        }
      })
        .then(({
          data
        }) => {
          localStorage.setItem('token', data.token)
          context.commit('setUser')
          context.dispatch('getAllQuestions', data._id)
        })
    },
    upvote: (context, payload) => {
      return new Promise(function (resolve, reject) {
        http.post(`/api/questions/upvote/${payload.questionId}`, {
          user: context.state.user._id
        })
          .then(({
            data
          }) => {
            context.commit('updateQuestion', {
              question: data
            })
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    downvote: (context, payload) => {
      return new Promise(function (resolve, reject) {
        http.post(`/api/questions/downvote/${payload.questionId}`, {
          user: context.state.user._id
        })
          .then(({
            data
          }) => {
            context.commit('updateQuestion', {
              question: data
            })
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    unvote: (context, payload) => {
      return new Promise(function (resolve, reject) {
        http.post(`/api/questions/unvote/${payload.questionId}`, {
          user: context.state.user._id
        })
          .then(({
            data
          }) => {
            context.commit('updateQuestion', {
              question: data
            })
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})
