<!-- componente que se llama desde personalMain y que presenta el formulario de filtro y el boton de busqueda -->
  <template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Filtrar por</div>
    </q-card-section>
    <q-form @submit="getRecords" class="q-gutter-y-xs">
        <q-input label="Fecha Inicio" class="col-xs-12 col-sm-5" clearable outlined stack-label
          v-model="filterR.fechaInicial" type="date" />
        <q-input label="Fecha Fin" class="col-xs-12 col-sm-5" clearable outlined stack-label
          v-model="filterR.fechaCierre"  type="date" />
        <q-input outlined clearable label="observaciones" stack-label v-model="filterR.observaciones" />
      <q-card-actions align="right">
        <q-btn  flat type="submit" label="Buscar" color="primary"/>
        <q-btn  flat label="Cancel" color="primary" @click="$emit('close')"/>
      </q-card-actions>
  </q-form>
  </q-card>
</template>

<script>
import { date } from 'quasar'
export default {
  props: ['value'],
  data () {
    return {
      filterR: {
        fechaInicial: '',
        fechaCierre: '',
        observaciones: ''
      }
    }
  },
  methods: {
    getRecords () {
      this.$emit('getRecords', this.filterR)
    },
    formatDate (date1) {
      return date.formatDate(date1, 'DD/MM/YYYY')
    }
  },
  mounted () {
    this.filterR = this.value
  }
}
</script>
