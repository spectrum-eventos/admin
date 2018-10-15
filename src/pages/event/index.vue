<script>
export default {
  name: 'event',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
  },
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <img src='statics/logo.png' class='logo' />

        <q-toolbar-title>
          Spectrum
          <div slot="subtitle">Painel Administrativo</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Menu</q-list-header>
        <q-item @click.native="$router.push(`/event/${id}/list`)">
          <q-item-side icon="list" />
          <q-item-main label="Gerenciar Chamadas" />
        </q-item>
        <q-item @click.native="$router.push(`/event/${id}/frequency`)">
          <q-item-side icon="contacts" />
          <q-item-main label="Ver frequência" />
        </q-item>
        <q-item @click.native="$router.push('/event')">
          <q-item-side icon="arrow back" />
          <q-item-main label="Voltar" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container class='view'>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.view {
  background: #F5F7FA
}
.logo {
  width: 50px;
  height: auto;
}
</style>
