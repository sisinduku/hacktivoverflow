import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000'
})
Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,

  state: {
    questions: [],
    user: {}
  },

  getters: {
    questions: state => state.questions,
    user: state => state.user
  },

  mutations: {
    setQuestions: (state, payload) => {
      state.questions = payload
    },
    addQuestion: (state, payload) => {
      state.questions.push(payload)
    },
    setUser: (state, payload) => {
      if (Object.keys(payload)
        .length !== 0) {
        Vue.set(state.user, '_id', payload._id)
        Vue.set(state.user, 'userID', payload.userID)
        Vue.set(state.user, 'name', payload.name)
        Vue.set(state.user, 'email', payload.email)
        Vue.set(state.user, 'profilePic', payload.profilePic)
        Vue.set(state.user, 'lastLogin', payload.lastLogin)
      } else {
        Vue.delete(state.user, '_id')
        Vue.delete(state.user, 'userID')
        Vue.delete(state.user, 'name')
        Vue.delete(state.user, 'email')
        Vue.delete(state.user, 'profilePic')
        Vue.delete(state.user, 'lastLogin')
      }
    }
  },

  actions: {
    getAllQuestions: (context, payload) => {
      http.get(`/api/questions/get_questions/${(!payload) ? '' : payload}`)
        .then(({
          data
        }) => {
          context.commit('setQuestions', data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    postQuestion: (context, payload) => {
      console.log(payload)
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
          context.commit('setUser', {
            _id: data._id,
            userID: data.userID,
            name: data.name,
            email: data.email,
            profilePic: data.profilePic,
            lastLogin: data.lastLogin
          })
        })
    }
  }
})
