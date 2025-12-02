  <!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div style="height: calc(100vh - 105px)">
      <q-item clickable v-ripple @click="expanded = !expanded" class="q-ma-md q-pa-xs bg-blue-grey-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
          <q-icon name="fas fa-filter" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            {{ nomFormulario }}
          </q-item-label>
          <q-item-label>
            <!-- poner un campo de fiterRecord que exista en este filtro -->
            <small>{{ Object.keys(filterRecord).length > 1 ? filterRecord : 'Pulse para definir filtro' }}</small>
          </q-item-label>
        </q-item-section>
        <q-item-section side >
          
          <q-btn  
            @click.stop="openForm()"  
            icon-right="help"
            label="Declaración Responsable"
          />

          <q-btn flat no-caps @click.stop="openForm()">              
            <div class="q-mr-sm">
              Nombre: SIF VIDAGESTUR |
            </div>
            <div class="q-mr-sm" >
              Código identificador: AA |
            </div>
            <div >
              Versión: 1
            </div>
          </q-btn>
          
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
        <facturasFilterAEAT
          v-model="filterRecord"
          @getRecords="getRecords"
          @hide="expanded = !expanded"
        />
      </q-dialog>

      <!-- formulario tabla de resultados de busqueda -->
      <facturasGridAEAT
        :value="filterRecord"
        fromFacturasMain=true
        :key="refreshKey"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { openURL } from 'quasar'
import facturasFilterAEAT from 'components/FacturasAEAT/facturasFilterAEAT.vue'
import facturasGridAEAT from 'components/FacturasAEAT/facturasGridAEAT.vue'
export default {
  props: ['id'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: false,
      refreshKey: 0,
      visible: '',
      filterRecord: {},
      nomFormulario: 'Facturas Emitidas - Enviadas AEAT'
    }
  },
  computed: {
    ...mapState('tabs', ['tabs']),
    ...mapState('login', ['user']) // importo state.user desde store-login
  },
  methods: {
    getRecords (filter) {
      
      this.filterRecord = Object.assign({}, filter)
      console.log('this.filterRecord al haber hecho el assign', this.filterRecord)
      this.refreshKey++
      this.expanded = false
    },
    openForm () {
        var strUrl = 'https://vidawm.com/sif-gestur/'
        if (window.cordova === undefined) { // desktop
          openURL(strUrl)
        } else { // estamos en un disp movil
          window.cordova.InAppBrowser.open(strUrl, '_system') // openURL
        }
      
    }
  },
  mounted () {
    // es la primera vez que entro, cargo valores po defecto
    /*  if (Object.keys(this.tabs['facturasMainAEAT-1'].meta.value).length > 0) {
      this.getRecords(this.tabs['facturasMainAEAT-1'].meta.value)
      console.log('getRec desde facturasMainAEAT', this.tabs['facturasMainAEAT-1'].meta.value)
    } else { // es la primera vez que entro, cargo valores po defecto*/
      this.filterRecord.tipoEstancia = '3'
    
      this.getRecords(this.filterRecord)
    //}
    
  },
  unmounted () {
    this.$emit('changeTab', Object.assign({}, this.filterRecord))
  },
  components: {
    facturasFilterAEAT: facturasFilterAEAT,
    facturasGridAEAT: facturasGridAEAT
  }
}
</script>
