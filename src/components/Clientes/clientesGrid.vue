<template>
  <q-item class="row q-ma-xs q-pa-xs">
    <!-- GRID. en row-key ponemos la columna del json que sea la id unica de la fila -->
    <q-table
      class="personalGrid-header-table"
      virtual-scroll
      :pagination="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      :rows="registrosSeleccionados"
      :columns="columns"
      table-style="max-height: 70vh; max-width: 93vw"
      wrap-cells
    >

      <template v-slot:header="props">
        <!-- CABECERA DE LA TABLA -->
        <q-tr :props="props">
          <q-th>-</q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
          <div :style="col.style">
            {{ col.label }}
          </div>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :key="`m_${props.row.id}`" @mouseover="rowId=`m_${props.row.id}`">
            <q-td>
              <div style="width: 70px" v-if="rowId === `m_${props.row.id}`">
                <q-icon  name="edit" class="text-grey q-pr-md" style="font-size: 1.2rem;" @click="editRecord(props.row, props.row.id)"/>
                <q-icon name="delete" class="text-red" style="font-size: 1.2rem;" @click="deleteRecord(props.row.id)"/>
              </div>
            </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
          <div :style="col.style">
              <div >{{ col.value }}</div>
          </div>
           </q-td>
        </q-tr>
      </template>
      <template v-slot:no-data>
        <div class="absolute-bottom text-center q-mb-sm">
          <q-btn
            @click.stop="addRecord"
            round
            dense
            color="indigo-5"
            size="20px"
            icon="add">
            <q-tooltip>Añadir Cliente</q-tooltip>
          </q-btn>
        </div>
        <div>
          Pulse + para añadir nuevo cliente
        </div>
      </template>
      <template v-slot:bottom>
        <div class="absolute-bottom text-center q-mb-sm">
          <q-btn
            @click.stop="addRecord"
            round
            dense
            color="indigo-5"
            size="20px"
            icon="add">
            <q-tooltip>Añadir Cliente</q-tooltip>
          </q-btn>
        </div>
        <div>
          {{ `${registrosSeleccionados.length ? registrosSeleccionados.length + ' Filas' : 'No hay registros, pulse + para añadir clientes'}` }}
        </div>
      </template>
    </q-table>
  </q-item>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['value', 'id', 'keyValue', 'fromClientesMain'], // en value tenemos el filtro
  data () {
    return {
      rowId: '',
      expanded: false,
      registrosSeleccionados: [],
      columns: [
        { name: 'id', align: 'left', label: 'ID', field: 'id' },
        { name: 'nombreCompleto', align: 'left', label: 'Nombre Completo', field: 'nombreCompleto', style: 'width: 250px; whiteSpace: normal' },
        { name: 'telefonos', label: 'Teléfono', align: 'left', field: 'telefonos', style: 'width: 100px' },
        { name: 'nroDoc', label: 'DNI/Pas', align: 'left', field: 'nroDoc' },
        { name: 'nacionalidad', align: 'left', label: 'Nacionalidad', field: 'nacionalidad' },
        { name: 'matricula', align: 'left', label: 'Matrícula', field: 'matricula' }
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  methods: {
    ...mapActions('tabs', ['addTab']),
    ...mapActions('clientes', ['borrarCliente', 'loadListaClientes', 'guardarDatosCliente']),
    getRecords (filterR) {
      // llamada al backend
      this.loadListaClientes(filterR)
        .then(response => {
          this.registrosSeleccionados = response.data
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
    },
    addRecord () {
      var record = {
        id: 0,
        nombre: 'Nuevo Cliente',
        apellido1: '',
        apellido2: '',
        pais: 'ESP',
        nacionalidad: 'ESP',
        tipoDoc: 2,
        email: '',
        matricula: '',
        direccion: '',
        cpostal: '',
        poblacion: '',
        provincia: '',
        telefonos: '',
        soporteDocumento: '',
        fechaExpedicion: '',
        fechaNacimiento: '',
        fechaValidez: '',
        tipoServicioPeriodico: '',
        precio: '',
        tipoFacturacion: '',
        codBanco: '',
        codSucursal: '',
        digitosControl: '',
        cuentaBancaria: '',
        user: '',
        ts: ''
      }
      this.guardarDatosCliente(record)
        .then(response => {
          record.id = response.data.id
          this.editRecord(record, record.id)
        })
        .catch(error => {
          this.$q.dialog({
            message: error.message
          })
        })
    },
    editRecord (rowChanges, id) {
      this.addTab(['editCliente', 'Editar Datos Cliente - ' + id, rowChanges, id]) // tercer elemento donde dejo rowChanges es VALUE en tab
    },
    deleteRecord (id) {
      this.$q.dialog({
        title: 'Confirmar',
        message: '¿ Borrar esta fila ?',
        ok: true,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.borrarCliente(id)
          .then(result => {
            var index = this.registrosSeleccionados.findIndex(function (record) { // busco elemento del array con este id
              if (record.id === id) return true
            })
            this.registrosSeleccionados.splice(index, 1)
            this.$q.dialog({
              message: 'Se ha borrado el cliente.'
            })
          })
          .catch(error => {
            this.$q.dialog({
              message: error.message
            })
          })
      })
    }
  },
  mounted () {
    if (Object.keys(this.value).length > 0) this.getRecords(this.value)
  }
}
</script>

<style lang="sass">
.personalGrid-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $blue-grey-1

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
