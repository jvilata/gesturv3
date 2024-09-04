<template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Filtrar por</div>
    </q-card-section>

    <q-form @submit="getRecords" class="q-gutter-y-xs">
      <q-input outlined clearable label="ID Estancia" stack-label v-model="filterR.id" />
      <q-input outlined clearable autofocus label="Nombre" stack-label v-model="filterR.nombre" />
      <q-select
            class="col-xs-6 col-sm-3"
            outlined
            label="Tipo Estancia"
            stack-label
            clearable
            v-model="filterR.tipoEstancia"
            :options="listaTipoEstancia"
            option-value="codElemento"
            option-label="valor1"
            emit-value
            map-options
          />
      <q-input
        outlined
        clearable
        label="Fecha Entrada Desde"
        stack-label
        v-model="filterR.fechaEntradaDesde"
        type="date"
      />
      <q-input
        outlined
        clearable
        label="Fecha Entrada Hasta"
        stack-label
        v-model="filterR.fechaEntradaHasta"
        type="date"
      />
      <q-select outlined clearable label="Tipo Servicio" stack-label
          v-model="filterR.tipoServicio"
          :options="listaServicios"
          option-value="id"
          :option-label="row=>row.descripcionCorta + ' ' + (row.Numero!== '0' ? row.Numero : '')"
          emit-value
          map-options
          use-input
          hide-selected
          fill-input
          input-debounce="0"/>
      <q-banner dense class="bg-grey-3">
      <template v-slot:avatar>
        <q-icon name="description" color="primary" />
      </template>
      <div class="row">
      Filtros de Factura
      </div>
      <div class="row">
      <q-checkbox class="col-xs-6 col-sm-6" v-model="val" @update:model-value="rellenarFechas" label="Las del año" />
      <q-select
        class="col-xs-6 col-sm-6"
        label="Facturadas"
        stack-label
        outlined
        clearable
        v-model="filterR.facturadas"
        :options="listaSINO"
        option-value="id"
        option-label="desc"
        emit-value
        map-options
      />
      <!--q-checkbox v-model="noFact" @update:model-value="noFacturadas" label="No facturadas" /-->
      </div>
      <q-input outlined clearable autofocus label="Nº. Factura" stack-label v-model="filterR.NroFactura" />
      <q-input
        outlined
        clearable
        label="Fecha Factura Desde"
        stack-label
        v-model="filterR.fechaFacturaDesde"
        type="date"
        class="q-mb-sm"
      />
      <q-input
        outlined
        clearable
        label="Fecha Factura Hasta"
        stack-label
        v-model="filterR.fechaFacturaHasta"
        type="date"
      />
    </q-banner>
      <q-card-actions align="right">
        <q-btn flat type="submit" label="Buscar" color="primary"/>
        <q-btn flat label="Cancel" color="primary" @click="$emit('hide')"/><!-- lo captura accionesMain -->
      </q-card-actions>
  </q-form>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { date } from 'quasar'
export default {
  props: ['value'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  data () {
    return {
      filterR: {
        fechaEntradaHasta: '',
        fechaEntradaDesde: ''
      },
      val: false,
      noFact: false
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaTipoEstancia', 'listaSINO']),
    ...mapState('servicios', ['listaServicios'])
  },
  methods: {
    rellenarFechas () {
      this.filterR.fechaFacturaDesde = date.formatDate(new Date(), 'YYYY-01-01')
      this.filterR.fechaFacturaHasta = date.formatDate(new Date(), 'YYYY-MM-DD')
    },
    /* noFacturadas () {
      this.filterR.noFacturadas = !this.filterR.noFacturadas
    }, */
    getRecords () {
      this.$emit('getRecords', this.filterR)
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD-MM-YYYY')
    }
  },
  mounted () {
    this.filterR = Object.assign({}, this.value) // asignamos valor del parametro por si viene de otro tab
  }
}
</script>
