<template lang="pug">
q-page.qrcodegenerator
  q-table(
    title='Presenças'
    row-key='id'
    rows-per-page-label='Itens por página'
    no-data-label='Suba uma planilha para poder '
    :loading='loading'
    :data='users'
    :columns='columns'
    ).table
    template(slot='top-right' slot-scope='props')
      input(id="sheet-input" ref="sheetInput" accept='.csv'
        type='file' @change="parseCSV")
      label(for="sheet-input").upload-label
        q-btn(
          label='subir planilha'
          color='primary'
          :loading='loading'
          @click.native='triggerInput').upload-button
    q-td(
      slot='body-cell-qrcode'
      slot-scope='props' :props='props'
      )
      qrcode(:value='props.row.name' :options='{ size: 100 }' :id='`qr-code-${props.row.id}`')
    q-td(
      slot='body-cell-actions'
      slot-scope='props' :props='props'
      )
      q-icon(
        name='ion-download'
        size='2rem'
        @click.native='showConfirmModal(props.row)'
        ).cursor-pointer
    div.row.flex-center.q-py-sm(slot='pagination', slot-scope='props')
      q-btn.q-mr-sm(round dense size='sm' icon='keyboard_arrow_left' color='secondary'
        :disable='props.isFirstPage', @click='props.prevPage')
      div.q-mr-sm(style='font-size: small')
        | Página {{ props.pagination.page }} / {{ props.pagination.totalPages }}
      q-btn(round dense size='sm' icon='keyboard_arrow_right' color='secondary'
        :disable='props.isLastPage' @click='props.nextPage')
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';

export default {
  name: 'qrcodegenerator',
  components: {
    [VueQrcode.name]: VueQrcode,
  },
  props: {
  },
  data() {
    return {
      loading: false,
      users: [],
      columns: [
        {
          name: 'id', label: 'Id', field: 'id', align: 'left',
        },
        {
          name: 'name', label: 'Nome', field: 'name', align: 'left',
        },
        { name: 'qrcode', label: 'QR Code' },
        { name: 'actions', label: 'Ações' },
      ],
    };
  },
  computed: {
  },
  methods: {
    triggerInput() {
      const input = document.querySelector('#sheet-input');
      input.click();
    },
    parseCSV(event) {
      const reader = new FileReader();
      reader.onload = this.generateQRCodes;
      reader.readAsText(event.target.files[0]);
    },
    async generateQRCodes(event) {
      this.loading = true;
      const names = event.target.result.split('\n');
      /* eslint-disable */
      for (let index = 0; index < names.length; index += 1) {
        const user = {
          id: index,
          name: names[index],
          qrCode: null,
        };
        this.users.push(user);
      }
      /* eslint-enable */
      this.loading = false;
    },
  },
};
</script>

<style lang='stylus' scoped>
.qrcodegenerator
  .table
    background white
  /* Esconde o input */
  input[type='file']
    display: none
  .upload-button
    z-index -1
  .upload-label
    z-index 1
</style>
