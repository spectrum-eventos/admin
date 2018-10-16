<template lang="pug">
q-page#admin-list
  q-table(
    title='Administradores' :loading='loading' :data='admins'
    :columns='columns' :rows-per-page-options='[25]'
    :pagination.sync='pageConfig' @request='fetchAdmins'
    row-key='id' rows-per-page-label='Itens por página'
    ).table
    template(slot='top-right' slot-scope='props')
      q-btn(label='Adicionar' color='primary' @click.native='$router.push("admin/create")')
    q-td(
      slot='body-cell-actions'
      slot-scope='props' :props='props'
      )
      q-icon(name='remove red eye'
        size='2rem' @click.native='$router.push("admin/show/" + props.row.id)').cursor-pointer
      q-icon(name='edit'
        size='2rem' @click.native='$router.push("admin/edit/" + props.row.id)').cursor-pointer
      q-icon(name='delete' size='2rem' @click.native='confirmAndExclude(props.row)').cursor-pointer
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
  name: 'admin-list',
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
          name: 'name', label: 'Nome', field: 'name', align: 'left',
        },
        {
          name: 'email', label: 'E-mail', field: 'email', align: 'left',
        },
        { name: 'actions', label: 'Ações' },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'admins',
    ]),
  },
  methods: {
    ...mapActions([
      'getAllAdmins',
      'deleteAdmin',
    ]),
    async fetchAdmins({ pagination }) {
      this.loading = true;
      const paginationObject = await this.getAllAdmins(pagination.page);
      this.pageConfig.rowsNumber = paginationObject.current_count;
      this.pageConfig.page = paginationObject.current_page;
      this.pageConfig.totalPages = paginationObject.total_pages;
      this.loading = false;
    },
    confirmAndExclude(admin) {
      if (admin.id === this.$auth.user().id) {
        this.$q.notify('Você não pode se excluir');
      } else {
        this.showConfirmModal(admin);
      }
    },
    async showConfirmModal(admin) {
      try {
        await this.$q.dialog({
          title: 'Confirmar exclusão',
          message: `Você tem certeza que deseja excluir o administrador ${admin.name}?
                    Esta ação não pode ser desfeita.`,
          ok: 'Tenho certeza',
          cancel: 'Não excluir',
        });
        this.exclude(admin.id);
      } catch (err) {
        this.$log.error(err);
      }
    },
    async exclude(id) {
      try {
        await this.deleteAdmin(id);
        this.$q.notify({
          type: 'positive',
          message: 'Administrador excluído com sucesso',
        });
        this.getAllAdmins();
      } catch (err) {
        this.$log.error(err);
        this.$q.notify('Ocorreu um erro, por favor, tente novamente.');
      }
    },
  },
  mounted() {
    this.fetchAdmins({ pagination: this.pageConfig.page });
  },
};
</script>

<style lang='stylus' scoped>
.table
  background white
</style>
