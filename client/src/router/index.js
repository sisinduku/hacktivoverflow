import Vue from 'vue'
import Router from 'vue-router'
import HomeComponent from '@/components/HomeComponent'
import QuestionsSummaryComponent from '@/components/QuestionsSummaryComponent'
import QuestionDetailComponent from '@/components/QuestionDetailComponent'
import UpdateQuestionComponent from '@/components/UpdateQuestionComponent'
import UpdateAnswerComponent from '@/components/UpdateAnswerComponent'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: HomeComponent,
    children: [{
      path: '',
      name: 'home',
      component: QuestionsSummaryComponent
    }, {
      path: 'question/:slug',
      name: 'detail',
      component: QuestionDetailComponent,
      props: true
    }, {
      path: 'question/edit/:slug',
      name: 'edit_question',
      component: UpdateQuestionComponent,
      props: true
    }, {
      path: 'answer/edit/:id',
      name: 'edit_answer',
      component: UpdateAnswerComponent,
      props: true
    }]
  }]
})
