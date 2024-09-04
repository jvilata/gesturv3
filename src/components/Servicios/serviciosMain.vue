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
        <serviciosFilter
          :value="filterRecord"
          @input="(value) => Object.assign(filterRecord, value)"
          @getRecords="getRecords"
          @hide="expanded = !expanded"
        />
      </q-dialog>

      <!-- formulario tabla de resultados de busqueda -->
      <serviciosGrid
        :value="filterRecord"
        :key="refreshKey"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import serviciosFilter from 'components/Servicios/serviciosFilter.vue'
import serviciosGrid from 'components/Servicios/serviciosGrid.vue'
export default {
  props: [], 
  data () {
    return {
      expanded: false,
      visible: '',
      refreshKey: 0,
      filterRecord: {},
      nomFormulario: 'Servicios'
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
    if (Object.keys(this.tabs['serviciosMain-1'].meta.value).length > 0) {
      Object.assign(this.filterRecord, this.tabs['serviciosMain-1'].meta.value)
      this.getRecords(this.filterRecord)
    } else { // es la primera vez que entro, cargo valores po defecto
      this.filterRecord = {}
      this.getRecords(this.filterRecord)
    }
  },
  unmounted () {
    this.$emit('changeTab', Object.assign({}, this.filterRecord))
  },
  components: {
    serviciosFilter: serviciosFilter,
    serviciosGrid: serviciosGrid
  }
}
</script>
