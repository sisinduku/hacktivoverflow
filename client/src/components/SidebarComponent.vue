<template>
  <div id='SidebarComponent'>
    <b-list-group>
      <b-list-group-item>
        Questions
      </b-list-group-item>
      <b-list-group-item v-for="question in questions" :key="question._id" class="text-left" :to="{ name: 'detail', params: { slug: question.slug}}" >
        {{question.title}}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
export default {
  name: 'SidebarComponent',

  data: () => ({}),

  props: ['questions']
}
</script>
<style scoped>
</style>
