<template lang="pug">
q-page#presence-presence
  q-table(
    title='Presenças'
    row-key='id'
    rows-per-page-label='Itens por página'
    no-data-label='Nenhum presença foi criado ainda'
    :loading='loading'
    :data='presences'
    :columns='columns'
    :rows-per-page-options='[25]'
    :pagination.sync='pageConfig'
    @request='fetchPresences'
    ).table
    q-td(
      slot='body-cell-actions'
      slot-scope='props' :props='props'
      )
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
import moment from 'moment';

export default {
  name: 'presence-presence',
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
        {
          name: 'date',
          label: 'Data',
          field: row => moment(row.date).format('LLLL'),
        },
        { name: 'actions', label: 'Ações' },
      ],
    };
  },
  computed: {
    ...mapGetters('presence', [
      'presences',
    ]),
  },
  methods: {
    ...mapActions('presence', [
      'getAllPresences',
      'deletePresence',
    ]),
    getParams({ page }) {
      return {
        page,
        'search[list_id_eq]': this.$route.params.id,
        'search[s]': 'name',
      };
    },
    async fetchPresences({ pagination }) {
      this.loading = true;
      const params = this.getParams(pagination);
      const paginationObject = await this.getAllPresences(params);
      this.pageConfig.rowsNumber = paginationObject.count;
      this.pageConfig.page = paginationObject.current_page;
      this.pageConfig.totalPages = paginationObject.total_pages;
      this.loading = false;
    },
    async showConfirmModal(presence) {
      try {
        await this.$q.dialog({
          title: 'Confirmar exclusão',
          message: `Você tem certeza que deseja excluir a presença do(a) ${presence.name}?
                    Esta ação não pode ser desfeita.`,
          ok: 'Tenho certeza',
          cancel: 'Não excluir',
        });
        this.exclude(presence.id);
      } catch (err) {
        this.$log.error(err);
      }
    },
    async exclude(id) {
      try {
        await this.deletePresence(id);
        this.$q.notify({
          type: 'positive',
          message: 'Presença excluído com sucesso',
        });
        this.fetchPresences({ pagination: this.pageConfig });
      } catch (err) {
        this.$log.error(err);
        this.$q.notify('Ocorreu um erro, por favor, tente novamente.');
      }
    },
  },
  mounted() {
    this.fetchPresences({ pagination: this.pageConfig });
  },
};
</script>

<style lang='stylus' scoped>
.table
  background white
</style>
