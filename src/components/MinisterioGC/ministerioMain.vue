<!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
<template>
    <div style="height: calc(100vh - 105px)">
      <q-item clickable v-ripple @click="expanded = !expanded" class="q-ma-md q-pa-xs bg-blue-grey-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
          <q-icon name="shield" />
        </q-item-section>
        <q-item-section>
          <div class="row">
            <q-item-label class="text-h6">
              {{ title }}
            </q-item-label>
            <q-select class="q-ml-lg col-xs-10 col-sm-5"
              dense
              outlined
              clearable
              label="Establecimiento"
              stack-label
              v-model="recordToSubmit.codEstablecimiento"
              :options="listaTiposGC"
              option-value="codEstablecimiento"
              option-label="nombreEstablecimiento"
              emit-value
              map-options
              use-input
              @update:model-value="getRecordsTipo1(recordToSubmit)"
            />
          </div>
        </q-item-section>
        <q-item-section side>
            <q-btn
            @click="$emit('close')"
            flat
            round
            dense
            icon="close"/>
        </q-item-section>
      </q-item>
        <div class="row q-ma-md">
        <q-input
            label="Fecha Inicial"
            class="col-xs-6 col-sm-4"
            clearable
            outlined
            stack-label
            v-model="recordToSubmit.FechaInicialEntrada"
            type="date"
          />
          <q-input
            label="Fecha Final"
            class="col-xs-6 col-sm-4"
            clearable
            outlined
            stack-label
            v-model="recordToSubmit.FechaFinalEntrada"
            type="date"
          />
          <q-btn outline class="col-xs-12 col-sm-4" color="primary" label="Generar Lista" @click="generarListaGC"/>
      </div>
    <q-card flat class="q-pb-xl">
      <q-list bordered>
        <q-expansion-item
          class="q-pt-none q-pl-xs q-pr-xs"
          group="somegroup"
          dense
          label="Cabecera Disco"
          default-opened
          header-class="bg-brown-1 text-grey-8"
        >
        <ministerioFormCabecera :value="regTipo1" :key="refresh" />
        </q-expansion-item>
        <q-separator />
        <q-expansion-item
          class="q-pt-xs q-pl-xs q-pr-xs"
          group="somegroup1"
          dense
          label="Detalle"
          default-opened
          header-class="bg-brown-1 text-grey-8"
        >
          <ministerioFormLineas :key="refresh" :regTipo1= "regTipo1" :value="listaRegTipo2"/>
        </q-expansion-item>
      </q-list>
    </q-card>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      listaTiposGC: [],
      recordToSubmit: {
        FechaInicialEntrada: '',
        FechaFinalEntrada: ''
      },
      generado: false,
      title: 'DISCO GUARDIA CIVIL',
      refresh: 0,
      hasChanges: false,
      colorBotonSave: 'primary',
      primeraVez: true,
      listaOpciones: [
        { name: 'generar', title: 'Generar Archivo GC', icon: 'print', function: 'generarGC' }
      ],
      regTipo1: {},
      listaRegTipo2: []
    }
  },
  computed: {
    ...mapState('login', ['user']) // importo state.user desde store-login
  },
  methods: {
    ...mapActions('ministerioGC', ['findTipo1', 'findTipo2', 'generarGC']),
    formatDate (date1) {
      return date.formatDate(date1, 'DD/MM/YYYY')
    },
    getRecordsTipo1 (reg) {
      // cabecera
      this.findTipo1(reg)
        .then(response => {
          
          if (this.listaTiposGC.length === 0) this.listaTiposGC = response.data
          Object.assign(this.regTipo1, response.data[0])
          this.recordToSubmit.codEstablecimiento = this.regTipo1.codEstablecimiento
          this.recordToSubmit.codEstMinisterio = this.regTipo1.codEstMinisterio
          this.refresh++
          this.getRecordsTipo2(this.regTipo1)
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
    },
    getRecordsTipo2 (reg1) {
      // lineas
      this.listaRegTipo2 = []
      console.log('reg1 metodo', reg1)
      this.findTipo2(reg1)
        .then(response => {
          console.log('response 2', response.data)
          Object.assign(this.listaRegTipo2, response.data)
          this.refresh++
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
    },
    generarListaGC () {
      // a implementar
      this.generado = true
      this.generarGC(this.recordToSubmit)
        .then(response => {
          this.getRecordsTipo1()
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
    }
  },
  mounted () {
    this.getRecordsTipo1({})
    if (this.recordToSubmit.FechaInicialEntrada === '') {
      this.recordToSubmit.FechaInicialEntrada = date.formatDate(new Date(), 'YYYY-MM-DD')
    }
    if (this.recordToSubmit.FechaFinalEntrada === '') {
      this.recordToSubmit.FechaFinalEntrada = date.formatDate(new Date(), 'YYYY-MM-DD')
    }
  },
  unmounted () {
    this.$emit('changeTab', Object.assign({}, this.filterRecord))
  },
  components: {
    ministerioFormCabecera: require('components/MinisterioGC/ministerioFormCabecera.vue').default,
    ministerioFormLineas: require('components/MinisterioGC/ministerioFormLineas.vue').default
  }
}
</script>
