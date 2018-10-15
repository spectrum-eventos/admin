<template lang="pug">
q-page.qrcodegenerator
  q-table(
    title='QR Codes'
    row-key='id'
    rows-per-page-label='Itens por página'
    no-data-label='Suba uma planilha para poder '
    :loading='loading'
    :data='users'
    :columns='columns'
    ).table
    template(slot='top-right' slot-scope='props')
      q-btn(
        label='baixar todos'
        color='primary'
        :disabled='users.length === 0'
        :loading='downloading'
        @click.native='downloadAll').q-mr-md
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
        @click.native='download(props.row)'
        ).cursor-pointer
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';
import JSZip from 'jszip';
import saveAs from 'file-saver';

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
      downloading: false,
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
      this.users = [];
      const names = event.target.result.split('\n');
      /* eslint-disable */
      for (let index = 1; index < names.length; index += 1) {
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
    download(user) {
      const qrCode = document.getElementById(`qr-code-${user.id}`);
      const imageToDownload = qrCode.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${user.name}.png`;
      link.href = imageToDownload;
      link.click();
    },
    async downloadAll() {
      this.downloading = true;
      const zip = new JSZip();
      const images = zip.folder('qrcodes');
      await this.users.map((user) => {
        const qrCode = document.getElementById(`qr-code-${user.id}`);
        const imageToDownload = qrCode.toDataURL().replace('data:image/png;base64,', '');
        return images.file(`${user.name}.png`, imageToDownload, { base64: true });
      });
      const zipContent = await zip.generateAsync({ type: 'blob' });
      this.downloading = false;
      saveAs(zipContent, 'qrcodes.zip');
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
