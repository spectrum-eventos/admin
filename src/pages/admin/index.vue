<template lang="pug">
q-page#admin-index
  router-view
</template>

<script>
export default {
  name: 'admin-index',
  components: {
  },
  async beforeRouteEnter(to, from, next) {
    try {
      next();
    } catch (err) {
      this.$log.error(err);
    }
  },
  props: {
  },
  data() {
    return {};
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang='stylus' scoped>
</style>
