import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import _ from 'lodash'

const http = axios.create({
  baseURL: 'https://overflow.mepawz.com'
})
Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,

  state: {
    questions: [],
    answers: [],
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
    setAnswers: (state, payload) => {
      state.answers = payload
    },
    addQuestion: (state, payload) => {
      state.questions.push(payload)
    },
    addAnswer: (state, payload) => {
      state.answers.push(payload)
    },
    updateQuestion: (state, payload) => {
      let idx = state.questions.findIndex(question =>
        question._id === payload.question._id
      )
      state.questions.splice(idx, 1, payload.question)
    },
    deleteQuestion: (state, payload) => {
      let idx = state.questions.findIndex(question =>
        question._id === payload.question._id
      )
      state.questions.splice(idx, 1)
    },
    updateAnswer: (state, payload) => {
      let idx = state.answers.findIndex(answer =>
        answer._id === payload.answer._id
      )
      state.answers.splice(idx, 1, payload.answer)
    },
    deleteAnswer: (state, payload) => {
      let idx = state.answers.findIndex(answer =>
        answer._id === payload.answer._id
      )
      state.answers.splice(idx, 1)
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
            context.commit('setAnswers', data)
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
    postAnswer: (context, payload) => {
      http.post(`/api/answers/post_answer`, {
        content: payload.content,
        question: payload.question._id,
        author: payload.author
      })
        .then(({
          data
        }) => {
          context.commit('addAnswer', data)
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
    deleteQuestion: (context, payload) => {
      return new Promise(function (resolve, reject) {
        http.delete(`/api/questions/delete_question/${payload.questionId}`, {
          author: payload.author
        })
          .then(({
            data
          }) => {
            context.commit('deleteQuestion', {
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
    updateAnswer: (context, payload) => {
      return new Promise(function (resolve, reject) {
        http.post(`/api/answers/update_answer/${payload.answerId}`, {
          content: payload.content,
          author: payload.author
        })
          .then(({
            data
          }) => {
            context.commit('updateAnswer', {
              answer: data
            })
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject(err)
          })
      })
    },
    deleteAnswer: (context, payload) => {
      return new Promise(function (resolve, reject) {
        http.delete(`/api/answers/delete_answer/${payload.answerId}`, {
          author: payload.author
        })
          .then(({
            data
          }) => {
            context.commit('deleteAnswer', {
              answer: data
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
    },
    upvoteAns (context, payload) {
      return new Promise(function (resolve, reject) {
        http.put(`/api/answers/upvote/${payload.answerId}`, {
          user: context.state.user._id
        })
          .then(({
            data
          }) => {
            context.commit('updateAnswer', {
              answer: data
            })
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject(err)
          })
      })
    },
    downvoteAns (context, payload) {
      return new Promise(function (resolve, reject) {
        http.put(`/api/answers/downvote/${payload.answerId}`, {
          user: context.state.user._id
        })
          .then(({
            data
          }) => {
            context.commit('updateAnswer', {
              answer: data
            })
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject(err)
          })
      })
    },
    unvoteAns (context, payload) {
      return new Promise(function (resolve, reject) {
        http.put(`/api/answers/unvote/${payload.answerId}`, {
          user: context.state.user._id
        })
          .then(({
            data
          }) => {
            context.commit('updateAnswer', {
              answer: data
            })
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject(err)
          })
      })
    }
  }
})
