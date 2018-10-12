<template lang='pug'>
q-page#create.q-mx-sm
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
        q-field.q-mt-md(
          icon='lock open'
          :error='passwordHasError'
          error-label='A senha deve ter no mínimo 8 caracteres'
          )
          q-input(
            v-model='form.password'
            float-label='Senha'
            type='password'
            @blur='$v.form.password.$touch'
            :error='$v.form.password.$error'
            )
        q-field.q-mt-md(
          icon='lock open'
          :error='confirmPasswordHasError'
          error-label='As duas senhas devem ser iguais'
          )
          q-input(
            v-model='form.confirmPassword'
            float-label='Confirmar Senha'
            type='password'
            @blur='$v.form.confirmPassword.$touch'
            :error='$v.form.confirmPassword.$error'
            )
        q-card-separator.q-my-md
        div.row.justify-end
          q-btn(
            type='submit'
            color='primary'
            label='adicionar'
            )
</template>

<script>
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
  name: 'CreateAdmin',
  data() {
    return {
      url: '',
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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
      password: {
        required,
        minLength: minLength(8),
      },
      confirmPassword: {
        sameAsPassword: sameAs('password'),
      },
    },
  },
  methods: {
    ...mapActions([
      'createAdmin',
    ]),
    submit() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.$q.notify('Por favor, reveja os campos em vermelho.');
        return;
      }

      this.submiting = true;
      this.addAdmin();
    },
    async addAdmin() {
      try {
        await this.createAdmin(this.form);
        this.$q.notify({
          type: 'positive',
          message: 'Administrador adicionado com sucesso',
        });
        this.submiting = false;
        this.$router.push('/admin');
      } catch (err) {
        this.$q.notify('Ocorreu um erro, por favor, tente novamente');
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

