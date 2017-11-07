<template>
  <div id='AnswerListComponent'>
    <b-list-group>
      <b-list-group-item class="text-justify">
        <h2>{{question.title}}</h2>
        <p v-html="question.content"></p>
        <ActionComponent :question="question"></ActionComponent>
        <b-row style="padding-top: 5px">
          <b-col>
            <b-button v-if="isLogin" size="sm" variant="secondary">
              <span class="fa fa-reply"></span> Answer
            </b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
export default {
  name: 'AnswerListComponent',

  props: ['answers'],

  data: () => ({

  })
}
</script>
<style scoped>
</style>
