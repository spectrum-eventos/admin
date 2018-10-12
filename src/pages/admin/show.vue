<template lang='pug'>
q-page#update.q-mx-sm
  q-card
    q-card-main
      q-btn(@click='$router.push("/admin")' color='primary') voltar
      div
        p.caption Dados do administrador
        q-item
          q-item-side
            q-item-tile
              q-icon(name='person' size='3rem')
          q-item-main(:label='admin.name', sublabel='Nome')
        q-item
          q-item-side
            q-item-tile
              q-icon(name='mail' size='3rem')
          q-item-main(:label='admin.email', sublabel='E-mail')
        q-card-separator.q-my-md
        div.row.justify-end
          q-btn(
            @click='$router.push("/admin/edit/" + admin.id)'
            color='primary'
            label='editar'
            )
          q-btn(
            @click='confirmAndExclude'
            color='primary'
            label='excluir'
            ).q-ml-md
</template>

<script>
import { mapActions } from 'vuex';

import store from '../../store';

export default {
  name: 'ShowAdmin',
  async beforeRouteEnter(to, from, next) {
    try {
      const admin = await store.dispatch('getAdmin', to.params.id);
      next((vm) => {
        vm.admin = admin;
      });
    } catch (err) {
      this.$log.error(err);
    }
  },
  data() {
    return {
      admin: {},
    };
  },
  computed: {
  },
  methods: {
    ...mapActions([
      'deleteAdmin',
    ]),
    confirmAndExclude() {
      if (this.admin.id === this.$auth.user().id) {
        this.$q.notify('Você não pode se excluir');
      } else {
        this.showConfirmModal();
      }
    },
    async showConfirmModal() {
      try {
        await this.$q.dialog({
          title: 'Confirmar exclusão',
          message: `Você tem certeza que deseja excluir o administrador ${this.admin.name}?
                    Esta ação não pode ser desfeita.`,
          ok: 'Tenho certeza',
          cancel: 'Não excluir',
        });
        this.exclude();
      } catch (err) {
        this.$log.error(err);
      }
    },
    async exclude() {
      try {
        await this.deleteAdmin(this.admin.id);
        this.$q.notify({
          type: 'positive',
          message: 'Administrador excluído com sucesso',
        });
        this.$router.push('/admin');
      } catch (err) {
        this.$log.error(err);
        this.$q.notify('Ocorreu um erro, por favor, tente novamente.');
      }
    },
  },
};
</script>

<style scoped>
.caption {
  margin-top: 10px;
  margin-bottom: 20px !important;
  border-bottom: solid #999 1px;
  padding-bottom: 7px;
}
</style>
