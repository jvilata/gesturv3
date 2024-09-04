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
        <usuariosFilter
          :value="filterRecord"
          @getRecords="(val) => getRecords(val)"
          @hide="expanded = !expanded"
        />
      </q-dialog>

      <!-- formulario tabla de resultados de busqueda -->
      <usuariosGrid
        :value="filterRecord"
        :key="refreshKey"
      />
    </div>
</template>

<script>
import usuariosFilter from 'components/Usuarios/usuariosFilter.vue'
import usuariosGrid from 'components/Usuarios/usuariosGrid.vue'
import { mapState } from 'vuex'
export default {
  props: [],
  data () {
    return {
      expanded: false,
      refreshKey: 0,
      visible: '',
      filterRecord: {},
      nomFormulario: 'Usuarios'
    }
  },
  computed: {
    ...mapState('tabs', ['tabs'])
  },
  methods: {
    getRecords (filter) {
      Object.assign(this.filterRecord, filter)
      this.refreshKey++
      this.expanded = false
    }
  },
  mounted () {
    if (Object.keys(this.tabs['usuariosMain-1'].meta.value).length > 0) {
      Object.assign(this.filterRecord, this.tabs['usuariosMain-1'].meta.value)
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
    usuariosFilter: usuariosFilter,
    usuariosGrid: usuariosGrid
  }
}
</script>
