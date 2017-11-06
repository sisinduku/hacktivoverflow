<template>
<div>
  <b-container id='HomeComponent' fluid>
    <b-row>
      <b-col>
        <NavbarComponent></NavbarComponent>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="3">
        <SidebarComponent :questions="questions"></SidebarComponent>
      </b-col>
      <b-col md="9">
        <b-row align-h="start">
          <b-col md="1">
            <UserComponent v-if="Object.keys(user).length !== 0"></UserComponent>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <router-view :questions="questions"></router-view>
          </b-col>
        </b-row>
      </b-col>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>
<script>
import Vuex from 'vuex'
import NavbarComponent from './NavbarComponent.vue'
import SidebarComponent from './SidebarComponent.vue'
import UserComponent from './UserComponent.vue'

export default {
  name: 'HomeComponent',

  components: {
    NavbarComponent,
    SidebarComponent,
    UserComponent
  },

  data: () => ({}),

  computed: {
    ...Vuex.mapGetters(['questions', 'user'])
  },

  methods: {
    ...Vuex.mapActions(['getAllQuestions'])
  },

  created () {
    this.getAllQuestions()
  }
}
</script>
<style scoped>
.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
}
.row {
  margin-top: 5px
}
</style>
