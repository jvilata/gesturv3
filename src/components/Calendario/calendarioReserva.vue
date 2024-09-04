<template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">{{ filterR.id !== undefined ?'Editar Reserva. Id: '+ filterR.id : 'Nueva Reserva' }}</div>
    </q-card-section>

    <q-form @submit="guardarReserva" class="q-gutter-y-xs">
      <!-- q-input outlined readonly label="Servicio" stack-label v-model="filterR.descServicio" /-->
      <q-select outlined clearable label="Tipo Servicio" stack-label
          v-model="filterR.idServicio"
          :options="listaServicios"
          option-value="id"
          :option-label="row=>row.descripcionCorta + ' ' + (row.Numero!== '0' ? row.Numero : '')"
          emit-value
          map-options
          use-input
          hide-selected
          fill-input
          input-debounce="0"/>
      <q-input
        outlined
        :rules="[val => !!val || 'Campo requerido']"
        clearable
        label="Fecha Entrada"
        stack-label
        v-model= "filterR.fechaEntrada"
        type="date"
      />
      <q-input
        outlined
        :rules="[val => val > filterR.fechaEntrada || 'La fecha salida debe ser mayor que entrada']"
        clearable
        label="Fecha Salida"
        stack-label
        v-model= "filterR.fechaSalida"
        type="date"
      />
      <q-input outlined clearable autofocus label="Cliente" stack-label v-model="filterR.cliente"  :rules="[val => !!val || 'Campo requerido']"/>
      <q-input outlined clearable autofocus label="Teléfono" stack-label v-model="filterR.telefono"/>
      <q-input outlined clearable autofocus label="Importe Ingresado" stack-label v-model="filterR.ingresado"/>
      <q-input outlined clearable autofocus label="Observaciones" stack-label v-model="filterR.observaciones" />
      <!--q-input outlined clearable label="ID Estancia" stack-label v-model="filterR.idEstancia" /-->
      <q-card-actions align="right">
        <q-btn v-if="filterR.id !== undefined && (filterR.ingresado===null || filterR.ingresado==='0' || filterR.ingresado==='')" flat label="Borrar reserva" color="negative" @click="borrarReserva()"/>
        <q-btn v-if="filterR.id !== undefined && (filterR.ingresado!==null && filterR.ingresado!=='0')" flat label="Devolver reserva" color="negative" @click="devolverReserva()"/>
        <q-btn class type="submit" label="Guardar" color="primary"/>
        <q-btn flat label="Cancel" color="primary" @click="$emit('hide')"/><!-- lo captura accionesMain -->
      </q-card-actions>
  </q-form>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { mapState } from 'vuex'
export default {
  props: ['value'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  data () {
    return {
      filterR: {
        fechaEntrada: '',
        fechaSalida: ''
      },
      val: false,
      noFact: false
    }
  },
  computed: {
    ...mapState('servicios', ['listaServicios'])
  },
  methods: {
    guardarReserva () {
      var serv = this.listaServicios.find(row => row.id === this.filterR.idServicio)
      if (serv) {
        this.filterR.descServicio = serv.descripcionCorta + ' ' + (serv.Numero !== '0' ? serv.Numero : '')
      }
      this.filterR.fechaEntrada = this.filterR.fechaEntrada.substr(0, 10)
      this.filterR.fechaSalida = this.filterR.fechaSalida.substr(0, 10)
      this.$emit('guardarReserva', this.filterR)
    },
    borrarReserva () {
      this.$q.dialog({
        title: 'Confirmar',
        message: '¿ Borrar esta reserva ?',
        ok: true,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$emit('borrarReserva', this.filterR)
      })
    },
    devolverReserva () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Recuerda introducir en observaciones el número de cuenta ¿ Devolver esta reserva ?',
        ok: true,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$emit('devolverReserva', this.filterR)
      })
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD-MM-YYYY')
    },
    formatDateInv(pdate) {
      console.log(pdate)
      return pdate.substring(6,10)+'-'+pdate.substring(3,5)+'-'+pdate.substring(0,2)
    }
  },
  mounted () {
    this.filterR = Object.assign({}, this.value) // asignamos valor del parametro por si viene de otro tab
    this.filterR.fechaEntrada = this.filterR.fechaEntrada.substring(0,10)
    this.filterR.fechaSalida = this.filterR.fechaSalida.substring(0,10)
  }
}
</script>
