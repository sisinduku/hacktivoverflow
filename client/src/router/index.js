import Vue from 'vue'
import Router from 'vue-router'
import HomeComponent from '@/components/HomeComponent'
import QuestionsSummaryComponent from '@/components/QuestionsSummaryComponent'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: HomeComponent,
    children: [{
      path: '',
      name: 'home',
      component: QuestionsSummaryComponent,
      props: true
    }, {
      path: '',
      name: 'detail',
      component: QuestionsSummaryComponent,
      props: true
    }]
  }]
})
