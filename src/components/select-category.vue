<template lang="pug">
div#select
  q-select(
    filter
    float-label='Catergoria de serviço' filter-placeholder='Buscar'
    :options='categoriesOptions'
    v-model='categorySelected'
    @input='getSubcategories'
    )
  q-select(
    multiple filter
    float-label='Subcatergoria de serviço' filter-placeholder='Buscar'
    :display-value='subCategoryLabel'
    :options='subCategoriesOptions'
    :disabled='subCategoriesOptions.length === 0'
    :readonly='subCategoriesOptions.length === 0'
    v-model='subCategoriesSelected'
    @input='$emit("selection", subCategoriesSelected)'
    ).q-mt-md
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'select-category',
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
    return {
      categorySelected: '',
      subCategoriesSelected: [],
      subCategories: [],
      subCategoriesLabels: [],
      selected: [],
    };
  },
  computed: {
    ...mapGetters([
      'categories',
    ]),
    categoriesOptions() {
      return this.categories.map((category) => {
        const option = { label: category.title, value: category.id };
        return option;
      });
    },
    subCategoriesOptions() {
      return this.subCategories.map((category) => {
        const option = { label: category.title, value: category.id };
        return option;
      });
    },
    subCategoryLabel() {
      return `Você selecionou ${this.subCategoriesSelected.length}
              subcategoria${this.subCategoriesSelected.length === 1 ? '' : 's'}`;
    },
  },
  methods: {
    ...mapActions([
      'getAllCategories',
      'getCategory',
    ]),
    async getSubcategories(category) {
      this.$q.loading.show();
      /* eslint-disable camelcase */
      const { sub_categories } = await this.getCategory(category);
      this.subCategories = [];
      this.subCategories.push(...sub_categories);
      /* eslint-enable camelcase */
      this.$q.loading.hide();
    },
  },
  mounted() {
    this.getAllCategories();
  },
};
</script>

<style lang='stylus' scoped>
</style>
