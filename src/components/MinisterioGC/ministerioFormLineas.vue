<template>
    <q-item class="row">
      <!-- GRID. en row-key ponemos la columna del json que sea la id unica de la fila -->
      <q-table
        class="facturasFormLineas-header-table"
        dense
        virtual-scroll
        :pagination="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
        row-key="id"
        :rows="listaRegTipo2"
        :columns="columns"
        table-style="max-height: 70vh; max-width: 93vw"
      >
  
        <template v-slot:header="props">
          <!-- CABECERA DE LA TABLA -->
          <q-tr :props="props">
            <q-th>
            </q-th>
  
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
  
        <template v-slot:body="props">
          <q-tr :props="props" :key="`m_${props.row.id}`" @mouseover="rowId=`m_${props.row.id}`">
            <q-td>
              <!-- columna de acciones: editar, borrar, etc -->
              <div style="width: 30px" class="q-mr-lg">
                <q-icon name="delete" class="text-red" style="font-size: 1.5rem;" @click="deleteRecord(props.row.id)"/>
              </div>
            </q-td>
  
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              <div :style="col.style">
                {{ col.value }}
              </div>
              <q-popup-edit
                v-if="!['id'].includes(col.name)"
                v-model="props.row[col.name]"
                buttons
                v-slot="scope"
                @save="updateRecord(props.row)" >
                <q-input
                  v-if="['Nombre', 'PrimerApellido', 'SegundoApellido', 'dni', 'pasaporte', 'soporteDocumento', 'direccion', 'codigoPostal', 'correo'].includes(col.name)"
                  type="text"
                  v-model="scope.value"
                  dense
                  autofocus/>
                <q-input
                    v-if="['FechaEntrada','FechaExp', 'FechaNac', 'fechaSalida'].includes(col.name)"
                    type="date"
                    :model-value="scope.value.substring(0,10)"
                    @update:model-value="v=>scope.value=v + ' 00:00:00'"
                    dense
                    autofocus/>
                <q-select
                  v-if="['sexo'].includes(col.name)"
                  outlined
                  v-model="scope.value"
                  :options="sexoList"
                  emit-value
                  map-options
                />
                <q-select
                  v-if="['TipoDoc'].includes(col.name)"
                  outlined
                  v-model="scope.value"
                  :options="tipoDocList"
                  emit-value
                  map-options
                />
                <q-select
                v-if="['PaisNac'].includes(col.name)"
                class="col-xs-5 col-sm-2"
                stack-label
                clearable
                outlined
                v-model="scope.value"
                :options="listaPaisesFilter"
                map-options
                option-value="codigoPais"
                option-label="nombrePais"
                emit-value
                @filter="filterPaises"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
              />
              <q-select
                v-if="['pais'].includes(col.name)"
                class="col-xs-5 col-sm-2"
                stack-label
                clearable
                outlined
                v-model="scope.value"
                :options="listaPaisesFilter"
                map-options
                option-value="codigoPais"
                option-label="nombrePais"
                emit-value
                @filter="filterPaises"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
              />
                <q-select
                  v-if="['codigoMunicipio'].includes(col.name)"
                  class="col-xs-5 col-sm-2"
                  stack-label
                  clearable
                  outlined
                  v-model="scope.value"
                  :options="listaMunicipiosFilter"
                  map-options
                  option-value="codigoMunicipio"
                  option-label="nombreMunicipio"
                  emit-value
                  @filter="filterMunicipios"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                />
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
  
        <template v-slot:no-data>
          <div class="absolute-bottom q-mb-sm" style="left: 45vw">
            <q-btn
              @click.stop="addRecord"
              round
              dense
              color="indigo-5"
              size="15px"
              icon="add"/>
          </div>
          <div>
            No hay registros, pulse el botón + para añadir
          </div>
        </template>
  
        <template v-slot:bottom>
          <div class="absolute-bottom q-mb-sm" style="left: 45vw">
            <q-btn
              @click.stop="addRecord"
              round
              dense
              color="indigo-5"
              size="15px"
              icon="add"/>
          </div>
          <div>
            {{ listaRegTipo2.length }} Filas
          </div>
        </template>
      </q-table>
    </q-item>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex'
  import { date } from 'quasar'
  
  export default {
    props: ['regTipo1', 'value'], // en 'value' tenemos la tabla de datos del grid
    data () {
      return {
        rowId: '',
        recordToSubmit: {},
        registrosSeleccionados: [],
        response: 0,
        listaMunicipiosFilter: this.listaMunicipios,
        listaPaisesFilter: this.listaPaises,
        registroEditado: {},
        columns: [
          { name: 'id', label: 'ID', align: 'center', field: 'id', sortable: true },
          { name: 'idEstancia', label: 'idEstancia', align: 'center', field: 'idEstancia', sortable: true },
          { name: 'Nombre', align: 'left', label: 'nombre', field: 'Nombre', sortable: true },
          { name: 'PrimerApellido', align: 'left', label: 'Primer Apellido', field: 'PrimerApellido', sortable: true },
          { name: 'SegundoApellido', align: 'left', label: 'Segundo Apellido', field: 'SegundoApellido', sortable: true },
         // { name: 'sexo', align: 'left', label: 'sexo', field: 'sexo', sortable: true },
          { name: 'TipoDoc', align: 'left', label: 'Tipo Doc.', field: 'TipoDoc', sortable: true },
          { name: 'dni', label: 'DNI', align: 'center', field: 'dni', sortable: true },
          { name: 'pasaporte', align: 'left', label: 'Pasaporte', field: 'pasaporte', sortable: true },
          { name: 'soporteDocumento', align: 'left', label: 'soporteDocumento', field: 'soporteDocumento', sortable: true },
          { name: 'FechaEntrada', align: 'left', label: 'Fecha Entrada', field: 'FechaEntrada', sortable: true, format: val => { var res = date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY'); return ((res === '30-11-1899') || (res === '31-12-1899') ? '' : res) } },
          { name: 'fechaSalida', align: 'left', label: 'Fecha Salida', field: 'fechaSalida', sortable: true, format: val => { var res = date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY'); return ((res === '30-11-1899') || (res === '31-12-1899') ? '' : res) } },
         // { name: 'FechaExp', align: 'left', label: 'Fecha Exp.', field: 'FechaExp', sortable: true, format: val => { var res = date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY'); return ((res === '30-11-1899') || (res === '31-12-1899') ? '' : res) } },
          { name: 'FechaNac', align: 'left', label: 'Fecha Nac.', field: 'FechaNac', sortable: true, format: val => { var res = date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY'); return ((res === '30-11-1899') || (res === '31-12-1899') ? '' : res) } },
          { name: 'PaisNac', align: 'left', label: 'paisNac', field: 'PaisNac', sortable: true }, //nacionalidad
          { name: 'direccion', align: 'left', label: 'direccion', field: 'direccion', sortable: true },
          { name: 'codigoMunicipio', align: 'left', label: 'Cod. Municipio', field: 'codigoMunicipio', sortable: true },
          { name: 'codigoPostal', align: 'left', label: 'Cod. Postal', field: 'codigoPostal', sortable: true },
          { name: 'pais', align: 'left', label: 'País', field: 'pais', sortable: true },
          { name: 'correo', align: 'left', label: 'Correo', field: 'correo', sortable: true }
        ],
        pagination: { rowsPerPage: 0 },
        listaRegTipo2: [],
        sexoList: [
          'M', 'H', 'O'
        ],
        tipoDocList: [
          'D', 'P', 'C'
        ],
        refresh: 0
      }
    },
    computed: {
      ...mapState('login', ['user']),
      ...mapState('ministerioGC', ['listaMunicipios', 'listaPaises'])
    },
    methods: {
      ...mapActions('tabs', ['addTab']),
      ...mapActions('ministerioGC', ['borrarTipo2', 'addTipo2']),
      formatDate (date1) {
        return date.formatDate(date1, 'DD/MM/YYYY')
      },
      filterMunicipios (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          this.listaMunicipiosFilter = this.listaMunicipios.filter(v => v.nombreMunicipio.toLowerCase().indexOf(needle) > -1)
        })
      },
      filterPaises (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.listaPaisesFilter = this.listaPaises.filter(v => v.nombrePais.toLowerCase().indexOf(needle) > -1)
      })
    },
      addRecord () {
        var record = {
          codEstablecimiento: this.regTipo1.codEstablecimiento,
          Nombre: '',
          PrimerApellido: '',
          SegundoApellido: '',
          dni: '',
          pasaporte: '',
          soporteDocumento: '',
          sexo: 'H',
          TipoDoc: 'D',
          FechaEntrada: date.formatDate(new Date(), 'YYYY-MM-DD 00:00:00'),
          fechaSalida: date.formatDate(new Date(), 'YYYY-MM-DD 00:00:00'),
          PaisNac: 'ESP',
          FechaExp: '2000-01-01 00:00:00',
          FechaNac: '2000-01-01 00:00:00',
          direccion: '',
          codigoMunicipio: '',
          codigoPostal: '',
          pais: 'ESP',
          correo: ''
        }
        this.addTipo2(record)
          .then(response => {
            record.id = response.data.id
            this.listaRegTipo2.push(record)
          })
          .catch(error => {
            this.$q.dialog({ title: 'Error', message: error })
          })
      },
      deleteRecord (id) {
        this.$q.dialog({
          title: 'Confirmar',
          message: '¿ Borrar esta fila ?',
          ok: true,
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.borrarTipo2(id)
            .then(response => {
              var index = this.listaRegTipo2.findIndex(function (record) { // busco elemento del array con este id
                if (record.id === id) return true
              })
              this.listaRegTipo2.splice(index, 1) // lo elimino del array
            })
            .catch(error => {
              this.$q.dialog({ title: 'Error', message: error })
            })
        })
      },
      updateRecord (record) { // Volvemos a llamar a addServicios con el contenido de props.row
        this.addTipo2(record)
          .then(response => {
            this.addTipo2(record)
            .then(response => {
              this.refresh++
            })
          })
          .catch(error => {
            this.$q.dialog({ title: 'Error', message: error })
          })
      }
    },
    mounted () {
      this.listaRegTipo2 = [...this.value]
    }
  }
  </script>
  
  
<style lang="sass">
.facturasFormLineas-header-table
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
  