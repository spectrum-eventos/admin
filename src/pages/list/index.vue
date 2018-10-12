<template lang='pug'>
q-layout(view='lHh Lpr lFf')
  q-layout-header.no-shadow
    q-toolbar.header.white-bg
      q-btn(
        icon='arrow back'
        flat
        @click='$router.go(-1)'
        ).no-padding.back-button
      q-toolbar-title.title
        | {{ list.name }}
  q-page-container.view
    router-view
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'list',
  data() {
    return {
      list: {},
    };
  },
  methods: {
    ...mapActions('list', [
      'getList',
    ]),
  },
  async mounted() {
    const { data } = await this.getList(this.$route.params.id);
    this.list = data;
  },
};
</script>

<style lang='stylus' scoped>
@import '~variables'
.view
  background #F5F7FA
.header
  .title
    font-weight 400
</style>
