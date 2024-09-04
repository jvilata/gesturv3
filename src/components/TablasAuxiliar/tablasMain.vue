<!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div style="height: 100vh">
      <q-item clickable v-ripple @click="expanded = !expanded" class="q-ma-md q-pa-xs bg-blue-grey-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
          <q-icon name="create" />
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
        <tablasFilter
          :value="filterRecord"
          @getRecords="getRecords"
          @hide="expanded = !expanded"
        />
      </q-dialog>

      <!-- formulario tabla de resultados de busqueda -->
      <tablasGrid
        :value="filterRecord"
        :key="refreshKey"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import tablasFilter from 'components/TablasAuxiliar/tablasFilter.vue'
import tablasGrid from 'components/TablasAuxiliar/tablasGrid.vue'
export default {
  props: [], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: false,
      refreshKey: 0,
      visible: '',
      filterRecord: {},
      nomFormulario: 'Tablas Auxiliar'
    }
  },
  computed: {
    ...mapState('tabs', ['tabs']),
    ...mapState('login', ['user']) // importo state.user desde store-login
  },
  methods: {
    getRecords (filter) {
      Object.assign(this.filterRecord, filter)
      this.refreshKey++
      this.expanded = false
    }
  },
  mounted () {
    if (Object.keys(this.tabs['tablasMain-1'].meta.value).length > 0) {
      this.getRecords(this.tabs['tablasMain-1'].meta.value) // refresco la lista por si se han hecho cambios
    } else { // es la primera vez que entro, cargo valores po defecto
      this.filterRecord = { codTabla: 0 }
      this.getRecords(this.filterRecord)
    }
  },
  unmounted () {
    this.$emit('changeTab', Object.assign({}, this.filterRecord))
  },
  components: {
    tablasFilter: tablasFilter,
    tablasGrid: tablasGrid
  }
}
</script>
