<template lang="pug">
q-page#list-list
  q-table(
    title='Chamadas'
    row-key='id'
    rows-per-page-label='Itens por página'
    no-data-label='Nenhum chamada foi criado ainda'
    :loading='loading'
    :data='lists'
    :columns='columns'
    :rows-per-page-options='[25]'
    :pagination.sync='pageConfig'
    @request='fetchLists'
    ).table
    template(slot='top-right' slot-scope='props')
      q-btn(label='Adicionar' color='primary' @click.native='addList')
    q-td(
      slot='body-cell-actions'
      slot-scope='props' :props='props'
      )
      q-icon(
        name='remove red eye'
        size='2rem'
        @click.native='$router.push("/list/" + props.row.id + "/presence")'
        ).cursor-pointer
      q-icon(name='edit'
        size='2rem' @click.native='editList(props.row)').cursor-pointer
      q-icon(name='delete' size='2rem' @click.native='showConfirmModal(props.row)').cursor-pointer
    div.row.flex-center.q-py-sm(slot='pagination', slot-scope='props')
      q-btn.q-mr-sm(round dense size='sm' icon='keyboard_arrow_left' color='secondary'
        :disable='props.isFirstPage', @click='props.prevPage')
      div.q-mr-sm(style='font-size: small')
        | Página {{ props.pagination.page }} / {{ props.pagination.totalPages }}
      q-btn(round dense size='sm' icon='keyboard_arrow_right' color='secondary'
        :disable='props.isLastPage' @click='props.nextPage')
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'list-list',
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
      loading: false,
      pageConfig: {
        rowsNumber: 25,
        page: 1,
        totalPages: null,
      },
      columns: [
        {
          name: 'id', label: 'Id', field: 'id', align: 'left',
        },
        {
          name: 'name', label: 'Nome', field: 'name', align: 'left',
        },
        { name: 'actions', label: 'Ações' },
      ],
    };
  },
  computed: {
    ...mapGetters('list', [
      'lists',
    ]),
  },
  methods: {
    ...mapActions('list', [
      'getAllLists',
      'createList',
      'updateList',
      'deleteList',
    ]),
    getParams({ page }) {
      return {
        page,
        'search[event_id_eq]': this.$route.params.id,
        'search[s]': 'name',
      };
    },
    async fetchLists({ pagination }) {
      this.loading = true;
      const params = this.getParams(pagination);
      const paginationObject = await this.getAllLists(params);
      this.pageConfig.rowsNumber = paginationObject.count;
      this.pageConfig.page = paginationObject.current_page;
      this.pageConfig.totalPages = paginationObject.total_pages;
      this.loading = false;
    },
    async addList() {
      try {
        const data = await this.$q.dialog({
          title: 'Criar chamada',
          message: 'Dê um nome ao chamada',
          prompt: {
            type: 'text',
          },
          ok: 'Criar',
          cancel: 'Cancelar',
        });
        this.create(data);
      } catch (err) {
        this.$log.error(err);
      }
    },
    async create(name) {
      try {
        await this.createList({ name, event_id: this.$route.params.id });
        this.$q.notify({
          type: 'positive',
          message: 'Chamada criado com sucesso',
          timeout: 1500,
        });
        this.fetchLists({ pagination: this.pageConfig });
      } catch (err) {
        this.$log.error(err);
        this.$q.notify({
          type: 'negative',
          message: 'Ocorreu um erro ao criar o chamada, por favor, tente novamente',
          timeout: 1500,
        });
      }
    },
    async editList(list) {
      try {
        const data = await this.$q.dialog({
          title: 'Editar chamada',
          message: 'Renomeie o chamada',
          prompt: {
            type: 'text',
            model: list.name,
          },
          ok: 'Atualizar',
          cancel: 'Cancelar',
        });
        this.edit(list.id, data);
      } catch (err) {
        this.$log.error(err);
      }
    },
    async edit(id, newName) {
      try {
        if (!newName) {
          this.$q.notify({
            type: 'negative',
            message: 'O nome do chamada não pode ser vazio',
            timeout: 1500,
          });
          return;
        }
        await this.updateList({ id, list: { name: newName } });
        this.$q.notify({
          type: 'positive',
          message: 'Chamada atualizado com sucesso',
          timeout: 1500,
        });
        this.fetchLists({ pagination: this.pageConfig });
      } catch (err) {
        this.$log.error(err);
        this.$q.notify({
          type: 'negative',
          message: 'Ocorreu um erro ao criar o chamada, por favor, tente novamente',
          timeout: 1500,
        });
      }
    },
    async showConfirmModal(list) {
      try {
        await this.$q.dialog({
          title: 'Confirmar exclusão',
          message: `Você tem certeza que deseja excluir o chamada ${list.name}?
                    Esta ação não pode ser desfeita.`,
          ok: 'Tenho certeza',
          cancel: 'Não excluir',
        });
        this.exclude(list.id);
      } catch (err) {
        this.$log.error(err);
      }
    },
    async exclude(id) {
      try {
        await this.deleteList(id);
        this.$q.notify({
          type: 'positive',
          message: 'Chamada excluído com sucesso',
        });
        this.fetchLists({ pagination: this.pageConfig });
      } catch (err) {
        this.$log.error(err);
        this.$q.notify('Ocorreu um erro, por favor, tente novamente.');
      }
    },
  },
  mounted() {
    this.fetchLists({ pagination: this.pageConfig });
  },
};
</script>

<style lang='stylus' scoped>
.table
  background white
</style>
