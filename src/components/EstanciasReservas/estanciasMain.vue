<template>
    <div style="height: calc(100vh - 105px)">
      <q-item clickable v-ripple @click="expanded = !expanded" class="q-ma-md q-pa-xs bg-blue-grey-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
          <q-icon name="event_available" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            {{ nomFormulario }}
          </q-item-label>
          <q-item-label>
            <!-- poner un campo de fiterRecord que exista en este filtro -->
            <small>{{ Object.keys(filterRecord).length > 0 ? filterRecord : 'Pulse para definir filtro' }}</small>
          </q-item-label>
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

      <q-dialog v-model="expanded"  >
        <!-- formulario con campos de filtro -->
        <estanciasFilter
          :value="filterRecord"
          @getRecords="(val) => getRecords(val)"
          @hide="expanded = !expanded"
        />
      </q-dialog>

      <!-- formulario tabla de resultados de busqueda -->
      <estanciasGrid
        :value="filterRecord"
        fromEstanciasMain=true
        :key="refreshKey"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: [], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: false,
      refreshKey: 0,
      visible: '',
      filterRecord: {},
      nomFormulario: 'Estancias y Facturas'
    }
  },
  computed: {
    ...mapState('tabs', ['tabs']),
    ...mapState('login', ['user']) // importo state.user desde store-login
  },
  methods: {
    getRecords (filter) {
      // hago la busqueda de registros segun condiciones del formulario Filter que ha lanzado el evento getRecords
      Object.assign(this.filterRecord, filter)
      this.refreshKey++
      this.expanded = false
    }
  },
  mounted () {
    if (Object.keys(this.tabs['estanciasMain-1'].meta.value).length > 0) {
      this.getRecords(this.tabs['estanciasMain-1'].meta.value)
    } else { // es la primera vez que entro, cargo valores po defecto
      this.filterRecord.tipoEstancia = '1'
      this.getRecords(this.filterRecord)
    }
  },
  unmounted () {
    this.$emit('changeTab', Object.assign({}, this.filterRecord))
  },
  components: {
    estanciasFilter: require('components/EstanciasReservas/estanciasFilter.vue').default,
    estanciasGrid: require('components/EstanciasReservas/estanciasGrid.vue').default
  }
}
</script>
