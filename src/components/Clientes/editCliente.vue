<template>
  <div>
    <q-item clickable v-ripple class="q-ma-xs q-pa-xs bg-blue-grey-1 text-grey-8" >
      <q-item-section>
        <q-item-label class="text-h6 q-ml-lg">
            {{ `Cliente - ${ cliente.nombre }` }}
        </q-item-label>
      </q-item-section>
      <q-btn icon="save"  class="q-ma-xs" :color="colorBotonSave" dense @click="guardarCliente"/>
      <q-item-section side>
          <q-btn
          @click="confirmarCierre"
          flat
          round
          dense
          icon="close"/>
      </q-item-section>
    </q-item>
    <q-card flat>
      <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
        <div class="row q-mb-sm">
          <q-input autogrow outlined clearable label="Nombre" v-model="cliente.nombre" class="col-xs-4 col-sm-4" />
          <q-input autogrow outlined clearable label="Primer Apellido" v-model="cliente.apellido1" class="col-xs-4 col-sm-4"/>
          <q-input autogrow outlined clearable label="Segundo Apellido" v-model="cliente.apellido2" class="col-xs-4 col-sm-4"/>
        </div>
        <div class="row q-mb-sm">
          <q-input outlined autogrow clearable label="Email" v-model="cliente.email" class="col-xs-7 col-sm-7" />
          <q-input outlined autogrow clearable label="Matrícula" v-model="cliente.matricula" class="col-xs-5 col-sm-5"/>
        </div>
        <div class="row q-mb-sm">
          <q-input outlined autogrow clearable label="Dirección" v-model="cliente.direccion" class="col-xs-12 col-sm-8"/>
          <!--<q-input outlined autogrow clearable label="Población" v-model="cliente.poblacion" class="col-xs-8 col-sm-4"/>-->
          <q-input outlined autogrow clearable label="C.Postal" v-model="cliente.cpostal" class="col-xs-4 col-sm-2"/>
          <q-input outlined autogrow clearable label="Provincia" v-model="cliente.provincia" class="col-xs-8 col-sm-6"/>
            <q-select
            class="col-xs-5 col-sm-2"
            label="Poblacion (cod.Municipio)"
            stack-label
            clearable
            outlined
            v-model="cliente.codigoMunicipio"
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
            use-chips
          />

          <q-input outlined  clearable label="País"  class="col-xs-4 col-sm-4"/>
          <q-select
            class="col-xs-4 col-sm-4"
            outlined
            autogrow
            stack-label
            clearable
            label="País Residencia"
            v-model="cliente.pais"   
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
            use-chips
              />
        </div>
        <div class="row q-mb-sm">
          <q-input outlined clearable label="Teléfonos" v-model="cliente.telefonos" class="col-xs-12 col-sm-12"/>
        </div>
        <div class="row q-mb-sm">
          <q-select
          class="col-xs-5 col-sm-2"
          label="Tipo Doc."
          stack-label
          clearable
          outlined
          v-model="cliente.tipoDoc"
          :options="listaTipoDoc"
          map-options
          option-value="codElemento"
          option-label="valor1"
          emit-value
        />
          <q-input outlined clearable label="DNI/Pasaporte" v-model="cliente.nroDoc" class="col-xs-7 col-sm-4"/>
          <q-input outlined clearable label="Soporte Documento" v-model="cliente.soporteDocumento" class="col-xs-7 col-sm-4"/>
          <q-input label="Fecha Nacimiento" class="col-xs-7 col-sm-3" clearable outlined stack-label
            v-model="cliente.fechaNacimiento" type="date"/>
          <q-select
            class="col-xs-5 col-sm-3"
            outlined
            autogrow
            stack-label
            clearable
            label="Nacionalidad"
            v-model="cliente.nacionalidad"   
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
        </div>
        <div class="row q-mb-sm">
          <q-input label="Fecha Expedición" class="col-xs-6 col-sm-6" clearable outlined stack-label
            v-model="cliente.fechaExpedicion" type="date"
            @blur="cambiaDatosExpedicion(cliente.fechaExpedicion)" />
           <q-input label="Fecha Validez" class="col-xs-6 col-sm-6" clearable outlined stack-label
            v-model="cliente.fechaValidez" type="date"/>
        </div>
        <div class="row q-mb-sm">
          <q-expansion-item
            expand-separator
            clearable
            icon="home"
            label="Cliente con Servicio Periódico"
            caption="Más info"
            style="width: 100%"
            header-class="bg-green-1"
          >
            <q-card>
              <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
                <div class="row q-mb-sm">
                  <q-select
                    class="col-xs-12 col-sm-5"
                    outlined
                    stack-label
                    clearable
                    label="Tipo Servicio Periódico"
                    v-model="cliente.tipoServicioPeriodico"
                    :options="listaServiciosPeriodicos"
                    option-value="id"
                    option-label="descripcionCorta"
                    emit-value
                    map-options
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"/>
                  <q-select
                    standout="bg-green-3"
                    class="col-xs-7 col-sm-4"
                    stack-label
                    outlined
                    clearable
                    label="Tipo Factura"
                    v-model="cliente.tipoFacturacion"
                    :options="listaTipoFact"
                    option-value="codElemento"
                    option-label="valor1"
                    emit-value
                    map-options
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                  />
                  <q-input outlined label="Precio" v-model="cliente.precio" class="col-xs-5 col-sm-3"/>
                </div>
                <div class="row q-mt-xs">
                  Cuenta Bancaria
                </div>
                <div class="row">
                  <q-input label="Cuenta / IBAN" outlined v-model="cliente.cuentaBancaria" class="col-xs-4 col-sm-4 q-pr-sm"/>
                </div>
              </q-card-section>
            </q-card>
         </q-expansion-item>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { date } from 'quasar'
export default {
  props: ['id'],
  data () {
    return {
      cliente: {
        fechaValidez: '',
        fechaNacimiento: ''
      },
      colorBotonSave: 'primary',
      refresh: 0,
      hasChanges: false,
      listaTipoServFilter: this.listaTipoServ,
      listaTipoFactFilter: this.listaTipoFact,
      listaMunicipiosFilter: this.listaMunicipios,
      listaPaisesFilter: this.listaPaises
    }
  },
  computed: {
    ...mapState('login', ['user']),
    ...mapState('tabs', ['tabs']),
    ...mapState('tablasAux', ['listaTipoDoc', 'listaTipoFact', 'listaTipoServ']),
    ...mapState('servicios', ['listaServiciosPeriodicos']),
    ...mapState('ministerioGC', ['listaMunicipios', 'listaPaises'])
    

  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    ...mapActions('clientes', ['loadDetallecliente', 'guardarDatosCliente', 'comboListaClientes']),
    ...mapActions('tabs', ['addTab']),
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
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD-MM-YYYY')
    },
    confirmarCierre () {
      this.guardarCliente()
      this.$emit('close')
    },
    guardarCliente () {
      this.guardarDatosCliente(this.cliente)
        .then(result => {
          this.hasChanges = false
          this.colorBotonSave = 'primary'
          this.$q.notify('Se han guardado los cambios')
          this.comboListaClientes() // refrescamos state listaClientes
        })
        .catch(error => {
          this.$q.dialog({
            message: error.message
          })
        })
    },
    cambiaDatosExpedicion (fechaEx) {
      const year = parseInt(fechaEx.substring(0, 4)) + 10
      this.cliente.fechaValidez = year + fechaEx.substring(4, 19)
    }
  },
  watch: {
    cliente: { // detecta cambios en las propiedades de este objeto (tienen que estar inicializadas en data())
      handler (val) {
        this.colorBotonSave = 'red'
        this.hasChanges = true
      },
      deep: true
    }
  },
  mounted () {
    console.log('lista', this.listaMunicipios)
    // loadDetalleCliente se le tiene que pasar el idCliente (contenido en keyValue)
    this.loadDetallecliente(this.tabs[this.id].meta.value.id)
      .then(response => {
        this.cliente = response.data[0]
        this.cliente.fechaNacimiento = this.cliente.fechaNacimiento.substring(0,10)
        this.cliente.fechaValidez = this.cliente.fechaValidez.substring(0,10)
        this.cliente.fechaExpedicion = this.cliente.fechaExpedicion.substring(0,10)
        setTimeout(() => { this.colorBotonSave = 'primary'; this.hasChanges = false }, 50) // dejo pasar un poco porque en el render se modifica el registro
      })
      .catch(error => {
        this.$q.dialog({ title: 'Error', message: error.message })
      })
  },
  unmounted () {
    if (this.hasChanges) {
      this.$q.dialog({ title: 'Aviso', message: '¿ Desea guardar cambios ?', ok: true, cancel: true, persistent: true })
        .onOk(() => { this.guardarCliente() })
    }
  }
}
</script>
