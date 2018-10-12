<template lang='pug'>
q-page#update.q-mx-sm
  q-card
    q-card-main
      q-btn(@click='$router.push("/admin")' color='primary') voltar
      form.createForm(@submit.prevent='submit')
        p.caption Dados do administrador
        q-field.q-mt-md(
          icon='person'
          :error='nameHasError'
          error-label='O nome é obrigatório'
          )
          q-input(
            v-model='form.name'
            float-label='Nome Completo'
            @blur='$v.form.name.$touch'
            :error='$v.form.name.$error'
            )
        q-field.q-mt-md(
          icon='mail'
          :error='mailHasError'
          error-label='E-mail inválido'
          )
          q-input(
            v-model='form.email'
            float-label='E-mail'
            @blur='$v.form.email.$touch'
            :error='$v.form.email.$error'
            )
        q-card-separator.q-my-md
        div.row.justify-end
          q-btn(
            type='submit'
            color='primary'
            label='atualizar'
            )
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

import store from '../../store';

export default {
  name: 'UpdateAdmin',
  async beforeRouteEnter(to, from, next) {
    try {
      const admin = await store.dispatch('getAdmin', to.params.id);
      next((vm) => {
        vm.id = admin.id;
        Object.keys(admin).map((prop) => {
          if (prop in vm.form) vm.form[prop] = admin[prop];
          return true;
        });
      });
    } catch (err) {
      this.$log.error(err);
    }
  },
  data() {
    return {
      url: '',
      id: '',
      form: {
        name: null,
        email: null,
      },
      mailHasError: null,
      nameHasError: null,
      passwordHasError: null,
      confirmPasswordHasError: null,
      submiting: false,
    };
  },
  validations: {
    form: {
      email: { required, email },
      name: { required },
    },
  },
  computed: {
    user() {
      return this.$auth.user();
    },
  },
  methods: {
    ...mapActions([
      'updateAdmin',
    ]),
    async submit() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.$q.notify('Por favor, reveja os campos em vermelho.');
        return;
      }

      this.submiting = true;
      await this.editAdmin();
      this.fetchUser();
    },
    async editAdmin() {
      try {
        await this.updateAdmin({ id: this.id, admin: this.form });
        this.$q.notify({
          type: 'positive',
          message: 'Administrador atualizado com sucesso',
        });
        this.submiting = false;
        this.$router.push('/admin');
      } catch (err) {
        this.$q.notify('Ocorreu um erro, por favor, tente novamente');
      }
    },
    fetchUser() {
      if (this.user.id === this.id) {
        this.$auth.fetch();
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
