<template>
  <div id='NavbarComponent'>
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand :to="{path: '/'}">Hactiv Overflow</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-nav is-nav-bar class="ml-auto">
          <b-nav-form>
            <b-button v-if="!isLogin" size="sm" variant="primary" @click="loginFB">
              Sign in with Facebook
            </b-button>
            <b-btn v-else size="sm" variant="danger" @click="logout">
              Logout
            </b-btn>
          </b-nav-form>
        </b-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  name: 'NavbarComponent',

  computed: {
    ...mapState(['isLogin']),
    ...mapGetters(['user'])
  },

  data: () => ({}),

  methods: {
    loginFB () {
      window.FB.login((response) => {
        if (response.status === 'connected') {
          this.getToken(response)
        }
      }, {
        scope: 'public_profile,email'
      })
    },
    logout () {
      window.localStorage.removeItem('token')
      this.$store.commit('logout')
    },
    ...mapActions(['getToken'])
  },

  created () {
    (function (d, s, id) {
      var js
      var fjs = d.getElementsByTagName(s)['0']
      if (d.getElementById(id)) return
      js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.FBAPPID,
        cookie: true, // enable cookies to allow the server to access
        xfbml: true, // parse social plugins on this page
        version: 'v2.8' // use graph api version 2.8
      })
    }
  }
}
</script>
<style scoped>
</style>
