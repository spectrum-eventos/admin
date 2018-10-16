<template lang="pug">
q-page#event-list
  q-table(
    row-key='id'
    rows-per-page-label='Itens por página'
    no-data-label='Nenhum evento foi criado ainda'
    :title='`Eventos - Total ${pageConfig.rowsNumber}`'
    :loading='loading'
    :data='events'
    :columns='columns'
    :rows-per-page-options='[25]'
    :pagination.sync='pageConfig'
    @request='fetchEvents'
    ).table
    template(slot='top-right' slot-scope='props')
      q-btn(label='Adicionar' color='primary' @click.native='addEvent')
    q-td(
      slot='body-cell-actions'
      slot-scope='props' :props='props'
      )
      q-icon(name='remove red eye'
        size='2rem' @click.native='$router.push("event/" + props.row.id + "/list")').cursor-pointer
      q-icon(name='edit'
        size='2rem' @click.native='editEvent(props.row)').cursor-pointer
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
  name: 'event-list',
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
        rowsNumber: 0,
        page: 1,
        totalPages: null,
      },
      columns: [
        {
          name: 'name', label: 'Nome', field: 'name', align: 'left',
        },
        { name: 'actions', label: 'Ações' },
      ],
    };
  },
  computed: {
    ...mapGetters('event', [
      'events',
    ]),
  },
  methods: {
    ...mapActions('event', [
      'getAllEvents',
      'createEvent',
      'updateEvent',
      'deleteEvent',
    ]),
    getParams({ page }) {
      return {
        page,
        'search[s]': 'name',
      };
    },
    async fetchEvents({ pagination }) {
      this.loading = true;
      const params = this.getParams(pagination);
      const paginationObject = await this.getAllEvents(params);
      this.pageConfig.rowsNumber = paginationObject.count;
      this.pageConfig.page = paginationObject.current_page;
      this.pageConfig.totalPages = paginationObject.total_pages;
      this.loading = false;
    },
    async addEvent() {
      try {
        const data = await this.$q.dialog({
          title: 'Criar evento',
          message: 'Dê um nome ao evento',
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
        await this.createEvent({ name });
        this.$q.notify({
          type: 'positive',
          message: 'Evento criado com sucesso',
          timeout: 1500,
        });
        this.fetchEvents({ pagination: this.pageConfig });
      } catch (err) {
        this.$log.error(err);
        this.$q.notify({
          type: 'negative',
          message: 'Ocorreu um erro ao criar o evento, por favor, tente novamente',
          timeout: 1500,
        });
      }
    },
    async editEvent(event) {
      try {
        const data = await this.$q.dialog({
          title: 'Editar evento',
          message: 'Renomeie o evento',
          prompt: {
            type: 'text',
            model: event.name,
          },
          ok: 'Atualizar',
          cancel: 'Cancelar',
        });
        this.edit(event.id, data);
      } catch (err) {
        this.$log.error(err);
      }
    },
    async edit(id, newName) {
      try {
        if (!newName) {
          this.$q.notify({
            type: 'negative',
            message: 'O nome do evento não pode ser vazio',
            timeout: 1500,
          });
          return;
        }
        await this.updateEvent({ id, event: { name: newName } });
        this.$q.notify({
          type: 'positive',
          message: 'Evento atualizado com sucesso',
          timeout: 1500,
        });
        this.fetchEvents({ pagination: this.pageConfig });
      } catch (err) {
        this.$log.error(err);
        this.$q.notify({
          type: 'negative',
          message: 'Ocorreu um erro ao criar o evento, por favor, tente novamente',
          timeout: 1500,
        });
      }
    },
    async showConfirmModal(event) {
      try {
        await this.$q.dialog({
          title: 'Confirmar exclusão',
          message: `Você tem certeza que deseja excluir o evento ${event.name}?
                    Esta ação não pode ser desfeita.`,
          ok: 'Tenho certeza',
          cancel: 'Não excluir',
        });
        this.exclude(event.id);
      } catch (err) {
        this.$log.error(err);
      }
    },
    async exclude(id) {
      try {
        await this.deleteEvent(id);
        this.$q.notify({
          type: 'positive',
          message: 'Evento excluído com sucesso',
        });
        this.fetchEvents({ pagination: this.pageConfig });
      } catch (err) {
        this.$log.error(err);
        this.$q.notify('Ocorreu um erro, por favor, tente novamente.');
      }
    },
  },
  mounted() {
    this.fetchEvents({ pagination: this.pageConfig });
  },
};
</script>

<style lang='stylus' scoped>
.table
  background white
</style>
