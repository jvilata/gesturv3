<template>
    <div style="height: calc(100vh - 113px)">
      <q-item clickable v-ripple @click="expanded = !expanded" class="q-ma-xs q-pa-xs bg-blue-grey-1 text-grey-8" >
        <q-item-section avatar>
          <q-icon name="search" size="md"/>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6 ">
            {{ nomFormulario }}
          </q-item-label>
          <q-item-label>
            <small>{{ Object.keys(filterRecord).length ? filterRecord : 'Pulse para definir filtro' }}</small>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
          @click="$emit('close')" flat round dense icon="close"/>
        </q-item-section>
      </q-item>
        <q-dialog v-model="expanded"  >
        <!-- Componente de filtro -->
        <clientesFilter
            :value="filterRecord"
            @getRecords="(val) => getRecords(val)"
            @close="expanded = !expanded"
        />
        </q-dialog>
      <!-- Tabla de resultados de busqueda -->
      <clientesGrid
        fromClientesMain=true
        :key="refreshKey"
        :value="filterRecord"
        />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: [],

  data () {
    return {
      nomFormulario: 'Lista de Clientes',
      refreshKey: 0,
      expanded: false,
      filterRecord: {}
    }
  },
  computed: {
    ...mapState('tabs', ['tabs'])
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    ...mapActions('clientes', ['loadListaClientes']),
    getRecords (filterR) {
      Object.assign(this.filterRecord, filterR) // no haría falta pero así obliga a refrescar el componente para que visulice el filtro
      this.expanded = false
      this.refreshKey++
    }
  },
  unmounted () {
    this.$emit('changeTab', Object.assign({}, this.filterRecord))
  },
  mounted () {
    if (Object.keys(this.tabs['clientesMain-1'].meta.value).length > 0) {
      this.getRecords(this.tabs['clientesMain-1'].meta.value) // refresco la lista por si se han hecho cambios
    }
  },
  components: {
    clientesFilter: require('components/Clientes/clientesFilter.vue').default,
    clientesGrid: require('components/Clientes/clientesGrid.vue').default
  }
}
</script>
