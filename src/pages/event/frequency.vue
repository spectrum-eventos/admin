<template lang="pug">
q-page.frequency
  q-table(
    title='Frequencia'
    row-key='id'
    rows-per-page-label='Itens por página'
    no-data-label='Nenhum presença foi criado ainda'
    :loading='loading'
    :data='approvedUsers'
    :columns='columns'
    ).table
    template(slot='top-right' slot-scope='props')
      .row.items-end
        q-field(label='Mostrar apenas aprovados' orientation='vertical').q-pa-md.field-frequency
          q-checkbox(
            v-model='showApproved'
            )
        q-field(label='Frequência desejada' orientation='vertical').q-pa-md.field-frequency
          q-input(
            inverted
            suffix='%'
            type='number'
            v-model='desiredFrequency'
            )
        q-field(label='Chamada' orientation='vertical').q-pa-md.field-list
          q-select(
            filter
            inverted
            multiple
            filter-placeholder='Buscar'
            :options='listOptions'
            :disabled='listOptions.length === 0'
            :readonly='listOptions.length === 0'
            v-model='selectedLists'
            ).field-list
    q-td(
      slot='body-cell-certified'
      slot-scope='props' :props='props'
      :class='certifiedClass(props.row.attendance)'
      ).animate-background
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'frequency',
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
      showApproved: false,
      columns: [
        {
          name: 'certified',
        },
        {
          name: 'name', label: 'Nome', field: 'name', align: 'left',
        },
        {
          name: 'frequency',
          label: 'Frequencia',
          field: row => this.selectedLists.length > 0 // eslint-disable-line no-confusing-arrow
            ? `${(row.attendance * 100) / this.selectedLists.length} %`
            : '?? %',
        },
      ],
      users: [],
      selectedLists: [],
      desiredFrequency: 75,
    };
  },
  computed: {
    ...mapGetters('presence', [
      'presences',
    ]),
    ...mapGetters('list', [
      'lists',
    ]),
    presenceParams() {
      return {
        'search[list_event_id_eq]': this.$route.params.id,
        'search[s]': 'name',
      };
    },
    listParams() {
      return {
        'search[event_id_eq]': this.$route.params.id,
        'search[s]': 'name',
      };
    },
    listOptions() {
      return this.lists.map((list) => {
        const option = {
          label: list.name,
          value: list.id,
        };
        return option;
      });
    },
    approvedUsers() {
      if (this.selectedLists.length > 0) {
        return this.showApproved
          ? this.users.filter((user) => {
            const frequency = (user.attendance * 100) / this.selectedLists.length;
            return frequency >= this.desiredFrequency;
          })
          : this.users;
      }

      return this.users;
    },
  },
  methods: {
    ...mapActions('presence', [
      'getAllPresences',
    ]),
    ...mapActions('list', [
      'getAllLists',
    ]),
    async fetchPresences() {
      await this.getAllPresences(this.presenceParams);
      await this.presences.map((presence) => {
        const user = this.users.filter(u => u.name === presence.name)[0];

        if (user) {
          user.attendance += 1;
        } else {
          this.users.push({
            name: presence.name,
            attendance: 1,
          });
        }

        return true;
      });

      await this.users.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    },
    certifiedClass(attendance) {
      if (this.selectedLists.length > 0) {
        const frequency = (attendance * 100) / this.selectedLists.length;
        return frequency >= this.desiredFrequency
          ? 'approved'
          : 'unapproved';
      }

      return 'unapproved';
    },
  },
  async mounted() {
    this.loading = true;
    await this.getAllLists(this.listParams);
    await this.fetchPresences();
    this.loading = false;
  },
};
</script>

<style lang='stylus' scoped>
.frequency
  .table
    background white
  .field-frequency
    width 100px
  .field-list
    width 300px
  .approved
    background #A3F185
  .unapproved
    background #ff9e9e
  .animate-background
    transition 300ms ease background
</style>
