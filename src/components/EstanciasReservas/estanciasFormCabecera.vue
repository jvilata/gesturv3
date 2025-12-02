<!-- componente que se llama desde accionesMain y que presenta el formulario de filtro y el boton de busqueda -->
  <template>
  <q-card class="q-pt-none q-pl-xs q-pr-xs">
      <div class="row">
        <q-input v-if="recordToSubmit.RegistroFactura == 'RegistroAlta'" class="col-xs-5 col-sm-1" readonly outlined label="ID Estancia" stack-label v-model="recordToSubmit.id" />
          <q-select
            v-if="recordToSubmit.RegistroFactura == 'RegistroAlta'"
            class="col-xs-7 col-sm-2"
            outlined
            label="Tipo Estancia"
            stack-label
            v-model="recordToSubmit.tipoEstancia"
            :options="listaTipoEstanciaFilter"
            option-value="codElemento"
            option-label="valor1"
            emit-value
            map-options
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            @filter="filterTipoEstancia"
          />
          <q-input class="col-xs-12 col-sm-2" readonly outlined label="Estado SIF - AEAT" stack-label v-model="recordToSubmit.estadoAeat" />

        <q-select
          class="col-xs-12 col-sm-7"
          outlined
          label="Cliente"
          stack-label
          :style="nifSelectStyle"
          v-model="recordToSubmit.idCliente"
          :options="listaClientesFilter"
          option-value="id"
          option-label="nombre"
          emit-value
          map-options
          @filter="filterClientes"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          @blur="validacionCliente(recordToSubmit)"
          :readonly="isFacturaGenerada"
        />
         
      </div>
      <div class="row" v-if="recordToSubmit.RegistroFactura == 'RegistroAlta'">
        <q-input
          label="Fecha Entrada"
          class="col-xs-6 col-sm-3"
          clearable
          outlined
          stack-label
          v-model="recordToSubmit.fechaEntrada"
          type="date"
          :readonly="isFacturaGenerada"
        />
        <q-input
          label="Fecha Salida"
          class="col-xs-6 col-sm-3"
          clearable
          outlined
          stack-label
          v-model="recordToSubmit.fechaSalida"
          type="date"
          :readonly="isFacturaGenerada"
        />
        <q-input class="col-xs-4 col-sm-2"  outlined label="N.Viajeros" stack-label v-model="recordToSubmit.numViajeros" :readonly="isFacturaGenerada"/>
        <q-input class="col-xs-8 col-sm-4"  outlined label="Observaciones" stack-label v-model="recordToSubmit.observaciones" :readonly="isFacturaGenerada" />
      </div>
      <div class="row q-mt-lg" v-if="recordToSubmit.RegistroFactura == 'RegistroAlta'">
        <q-input class="col-xs-4 col-sm-2" outlined readonly label="Base" stack-label v-model="recordToSubmit.base" />
        <q-input class="col-xs-4 col-sm-1" outlined label="%Retención" stack-label v-model="recordToSubmit.porRetencion" @blur="$emit('calculaTotalesEst', recordToSubmit)" :readonly="isFacturaGenerada"/>
        <q-input class="col-xs-4 col-sm-1" outlined readonly label="Importe retención" stack-label v-model="recordToSubmit.Retencion"/>
        <q-input class="col-xs-6 col-sm-2" outlined readonly label="Total IVA" stack-label v-model="recordToSubmit.totalIva"/>
        <q-input class="col-xs-6 col-sm-2" outlined readonly label="Total Estancia" stack-label v-model="recordToSubmit.totalEstancia" />
        <q-input class="col-xs-3 col-sm-1" outlined label="Fianza" stack-label v-model="recordToSubmit.Fianza" :readonly="isFacturaGenerada" />
        <q-input class="col-xs-3 col-sm-1" outlined label="En efectivo" stack-label v-model="recordToSubmit.ACuenta" :readonly="isFacturaGenerada"/>
        <q-input class="col-xs-3 col-sm-1" outlined label="Transferencia" stack-label v-model="recordToSubmit.PorBanco" :readonly="isFacturaGenerada" />
        <q-input class="col-xs-3 col-sm-1" outlined label="TPV" stack-label v-model="recordToSubmit.PorDatafono" :readonly="isFacturaGenerada"/>
      </div>
      <div class="row q-mt-sm" >
        <q-btn outline class="col-xs-12 col-sm-2" color="primary" label="Generar Factura" @click="validacionDatosFactura(recordToSubmit)" :disable="isFacturaGenerada" /> <!-- -->
        <q-input
            label="Fecha Factura"
            class="col-xs-6 col-sm-2"
            clearable
            outlined
            stack-label
            v-model="recordToSubmit.FechaFactura"
            type="date"
            :readonly="isFacturaGenerada"
          />
        <q-input v-if="recordToSubmit.RegistroFactura == 'RegistroAlta'" class="col-xs-6 col-sm-1" outlined label="Número Factura" stack-label v-model="recordToSubmit.NroFactura" 
            :readonly="isFacturaGenerada" />
        
  <!--   <div class="col"></div>

        <q-select
          class="col-xs-12 col-sm-1"
          outlined
          label="Tipo Registro"
          stack-label
          v-model="recordToSubmit.RegistroFactura"
          :options="listaRegistro"
          option-value="codElemento"
          option-label="valor1"
          map-options
          emit-value
          :readonly="isFacturaGenerada"
        />

        <q-select
          v-if="recordToSubmit.RegistroFactura !== 'RegistroAlta'"
          class="col-xs-12 col-sm-2"
          outlined
          label="Nro Factura Anular"
          stack-label
          v-model="recordToSubmit.NroFactura"
          :options="listaFactEmitidasFilter"
          option-value="nroFactura"
          option-label="nroFactura"
          emit-value
          map-options
          @filter="filterEstanciasFactEmitidas"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :readonly="isFacturaGenerada"
           />

         
        <q-select
          v-if="recordToSubmit.RegistroFactura == 'RegistroAlta'"
          class="col-xs-12 col-sm-2 "
          outlined
          label="Tipo Factura"
          stack-label
          v-model="recordToSubmit.TipoFactura"
          :options="listaTipoFacturaEmitida"
          option-value="codElemento"
          option-label="valor1"
          map-options
          emit-value
          :readonly="isFacturaGenerada"
        />

        <q-select
          v-if="recordToSubmit.RegistroFactura == 'RegistroAlta'"
          class="col-xs-12 col-sm-1"
          outlined
          label="Emisor Factura:"
          stack-label
          v-model="recordToSubmit.EmitidaPorTerceroODestinatario"
          :options="listaEmitidaPor"
          emit-value
          :readonly="isFacturaGenerada"
        />
      -->
      </div>
    
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'
import { headerFormData } from 'boot/axios.js'

export default {
  props: ['value'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  data () {
    return {
      listaClientesFilter: this.listaClientes,
      listaTipoEstanciaFilter: this.listaTipoEstancia,
      recordToSubmit: {},
      disableNroFactura: false,
      nifValidationClass: '', // Inicialmente vacía
      validacionCli: '',
      pais: '',
      nacionalidad: '',
      tipoDoc: '',
      descripcion: '',
      objRecord: {},
      validacionFact: '',
      listaEmitidaPor: ['SELF', 'Destinatario', 'Tercero'],
      listaFactEmitidasFilter: []

    }
  },
  computed: {
    ...mapState('login', ['user']),
    ...mapState('clientes', ['listaClientes']),
    ...mapState('estancias', ['listaNumFactEmitidas']), //devuelvo id de estancias
    ...mapState('tablasAux', ['listaTipoEstancia', 'listaTipoTarifa', 'listaTipoFacturaEmitida', 'listaRegistro']),
   // ...mapState('estancias', ['listaNumFactEmitidas']),

   isFacturaGenerada() {
        // Normalizamos el valor para considerar 0, '0', '', y null como "no generada"
        const nro = Number(this.recordToSubmit.NroFactura);
        const estado = this.recordToSubmit.estadoAeat;

        const nroFact = (nro !== null && nro !== 0 && nro !== '0' && nro !== '');
        const estadoAeat = (estado === 'ENVIADA AEAT');
        return (nroFact && estadoAeat);
    },
    
    nifSelectStyle() {
      // Determine the background color based on nifValidationClass
      let bgColor = 'white'; // Default or no validation color
      if (this.nifValidationClass === 'q-select-success') {
        bgColor = '#e6ffe6'; // Light green
      } else if (this.nifValidationClass === 'q-select-error') {
        bgColor = '#ffe6e6'; // Light red
      } else if (this.nifValidationClass === 'q-select-warning') {
        bgColor = '#fffacd'; // Light yellow
      }
      // Return a style object. Quasar will interpret this and apply it correctly.
      // For outlined fields, directly setting backgroundColor on the component often works
      // because Quasar internally applies it to the correct child element or uses it
      // to set its own CSS variable like --q-field-bg.
      return {
        backgroundColor: bgColor
      };
    }
  },
  methods: {
    ...mapActions('estancias', ['generarFactura', 'findEstancia', 'addEstancia']),
    filterClientes (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.listaClientesFilter = this.listaClientes.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterTipoEstancia (val, update) {
      if (val === '') {
        // Si el valor es vacío, mostrar la lista completa
        update(() => {
          this.listaTipoEstanciaFilter = this.listaTipoEstancia
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        // Filtrar por el campo que se muestra (option-label="valor1")
        this.listaTipoEstanciaFilter = this.listaTipoEstancia.filter(v => v.valor1.toLowerCase().indexOf(needle) > -1)
  })
    },
    filterEstanciasFactEmitidas (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        // Asegúrate de que this.listaNumFactEmitidas sea un array antes de intentar filtrar
        // Aunque el watcher ya se encargará de esto, es una buena práctica de seguridad.
        if (Array.isArray(this.listaNumFactEmitidas)) {
          this.listaFactEmitidasFilter = this.listaNumFactEmitidas.filter(v => v.id.toLowerCase().indexOf(needle) > -1)
        } else {
          this.listaFactEmitidasFilter = []; // Si no es array, resetea a vacío
        }
      })
    },
    formatDate (date1) {
      return date.formatDate(date1, 'DD/MM/YYYY')
    },
    validacionDatosFactura (record) {

      //Primero guardo
      this.addEstancia(this.recordToSubmit)
        .then(response => {
          
          this.$q.notify('Se ha actualizado registro')
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })


      this.validacionFact = ''
      this.descripcion = ''
      var totalIva = this.recordToSubmit.totalIva
      var base = this.recordToSubmit.base
      var tipoImpositivoFact = ''

      if((totalIva !== "" && totalIva !== null) && (base !== "" && base !== null)) {
        tipoImpositivoFact = Math.round((totalIva / base) * 100)
        //console.log('tipoFact 1: ', tipoImpositivoFact)
      }

      
     
      return this.validacionCliente(record) // Devuelve la promesa del final de validacionCliente
        .then(() => {
          // Metodo en backend para comprobar que hay datos de: base imponible, tipo imposiivo, cuota total, importe total y descripcion (ver tabla reservas)
          return this.$axios.get(`estancias/bd_estancias.php/validoDatosFact`, { params: { id: record.id } }) //en record.id va el idEstancia
        })  
          .then(response => { 
            
                if ((response.data.descripcionCorta !== "" && response.data.descripcionCorta !== null) && (response.data.tipoImpositivo !== "" && response.data.tipoImpositivo !== null) ) {
                  
                 // console.log('tipoFact 2: ', Math.round(response.data.tipoImpositivo))
                  if(tipoImpositivoFact == Math.round(response.data.tipoImpositivo)) { // compruebo si es igual a la primera linea de la fact
                    
                       this.validacionFact = 'OK'
                      this.descripcion = response.data.descripcionCorta
                      //TODO OK
                        
                       this.rellenarDatosFact()
                      //PARA LAS PRUEBAS - PONGO AQUI this.copiarFacturasAEAT(this.recordToSubmit), LUEGO LO TENDRE QUE QUITAR Y PONER ABAJO (rellenarDatosFact)
                     // this.copiarFacturasAEAT(this.recordToSubmit)
                  } else {
                    this.validacionFact = 'ERROR'
                    this.$q.dialog({ title: 'Aviso', message: 'No se ha generado la factura porque se tienen distintos tipos impositivos' })
          

                  } 
                } else this.validacionFact = 'ERROR'
                
          })
          .catch(error => {
            
            this.$q.dialog({ title: 'Error', message: error.response.data.error })
            this.validacionFact = 'ERROR'
            
          })
            
        
      

    },
    rellenarDatosFact () {
      // solo hay que generar factura cuando nroFactura sea cero
      
      if ((this.recordToSubmit.estadoAeat !== 'ENVIADA AEAT' )||(this.recordToSubmit.NroFactura === null || this.recordToSubmit.NroFactura === '0' || this.recordToSubmit.NroFactura === 0 || this.recordToSubmit.NroFactura === '')) {
        
        //Si todas las validaciones OK - entonces envío a AEAT
        
        if(this.validacionCli === 'OK' && this.validacionFact === 'OK'){
          this.generarFactura(this.recordToSubmit)
            .then(response => {
              // volvemos a leer la factura
              this.findEstancia({ id: this.recordToSubmit.id })
                .then(response => {
                  Object.assign(this.recordToSubmit, response.data[0])
                  if (this.recordToSubmit.fechaEntrada) this.recordToSubmit.fechaEntrada = this.recordToSubmit.fechaEntrada.substring(0,10)
                  if (this.recordToSubmit.fechaSalida) this.recordToSubmit.fechaSalida = this.recordToSubmit.fechaSalida.substring(0,10)
                  if (this.recordToSubmit.FechaFactura) this.recordToSubmit.FechaFactura = this.recordToSubmit.FechaFactura.substring(0,10)
                    //aqui cambiamos almacenamos en facturasaeat y cambiamos estado de factura de PENDIENTE A GENERADA AEAT
                     this.copiarFacturasAEAT(this.recordToSubmit)
                })
                .catch(error => {
                  this.$q.dialog({ title: 'Error', message: error })
                })
            })
            .catch(error => {
              this.$q.dialog({ title: 'Error', message: error })
            })
        } else { //this.validacionCli === 'ERROR' por algun motivo: el cliente no tiene nombre, dni, tipoDoc o pais

            if (this.nacionalidad == "") this.$q.dialog({ title: 'Aviso', message: 'El cliente no tiene nacionalidad asignada, añádelo para poder generar factura' })
            
            if (this.tipoDoc == "") this.$q.dialog({ title: 'Aviso', message: 'El cliente no tiene TipoDoc seleccionado, añádelo para poder generar factura' })
            
            if (this.objRecord.Nombre == "" || this.objRecord.Nif == "") this.$q.dialog({ title: 'Aviso', message: 'Revisa el DNI/Pasapote de cliente para poder generar factura' })
                      
            
        }
      } else {
        this.$q.dialog({
          title: 'Aviso',
          message: 'Ya se ha generado una factura para esta estancia',
          ok: true,
          persistent: true
        }).onOk(() => {
          this.$emit('close')
        })
      }
    },
    copiarFacturasAEAT(record) {
      //Metodo para copiar datos en tabla: facturasaeat, y así que los campos que se visualicen desde el componente FACTURAS AEAT, sean los de la tabla AEAT
      var formData = new FormData()
      for (var key in record) {
        formData.append(key, record[key])
      }
      return this.$axios.post(`facturasAEAT/bd_facturasAEAT.php/guardarBD`, formData, headerFormData)
        .then(response => {
            var res = response.data //aqui tengo el lastId insertado en facturasAEAT
            var formData1 = new FormData()
            formData1.append('id', res.id) //aqui tengo id de la tabla facturas aeat
            formData1.append('estadoFactura', record.estadoAeat) //PENDIENTE
            formData1.append('idCliente', record.idCliente) //paso idCliente para consultar si es extranjero o no
            
            
            return this.$axios.post(`SIF/verifactu2.php/preparoVerifactu`, formData1, headerFormData)
                    .then(response => {
                      
                      const estadoAEAT = JSON.stringify(response.data.textoValidacion).slice(1,-1);
                      
                      
                      formData.append("estadoAEAT", estadoAEAT) //Correcto, Incorrecto
                      formData.append('idAeat', res.id)

                       const respuestaAEAT_Base64 = response.data.respuestaAEAT;
                         // 1. Decodificar el string Base64
                        const respuestaAEAT_Decodificada = atob(respuestaAEAT_Base64);
                       // formData.append("respAEAT", JSON.stringify(response.data))
                       formData.append("respAEAT", respuestaAEAT_Decodificada)

                      if(estadoAEAT == 'Incorrecto') {
                          
                        // 2. Usar una expresión regular para encontrar el error
                        // Busca el texto que está entre <tikR:DescripcionErrorRegistro> y </tikR:DescripcionErrorRegistro>
                        const regex = /<tikR:DescripcionErrorRegistro>(.*?)<\/tikR:DescripcionErrorRegistro>/;
                        const match = respuestaAEAT_Decodificada.match(regex);
                        let descripcionError = 'Detalle de error no encontrado en el XML.';

                        if (match && match[1]) {
                            // El grupo de captura (.*?) contiene el texto del error
                            descripcionError = match[1];
                        }
                        // 3. Mostrar el diálogo con el error específico
                        this.$q.dialog({ 
                            title: '❌ Error en Envío AEAT', 
                            message: `<p>Estado: <strong>${estadoAEAT}</strong></p><p><strong>Detalle del Error:</strong> ${descripcionError}</p>`,
                            html: true 
                        });
                      } else {
                        this.$q.dialog({ title: 'Factura generada', message: estadoAEAT })
                      }
                      
                       
                      return this.$axios.post('facturasAEAT/bd_facturasAEAT.php/almacenoRespAEAT', formData, headerFormData)
                        .then(response => {
                                                    
                          this.findEstancia({ id: this.recordToSubmit.id })
                            .then(response => {
                              Object.assign(this.recordToSubmit, response.data[0])
                              if (this.recordToSubmit.fechaEntrada) this.recordToSubmit.fechaEntrada = this.recordToSubmit.fechaEntrada.substring(0,10)
                              if (this.recordToSubmit.fechaSalida) this.recordToSubmit.fechaSalida = this.recordToSubmit.fechaSalida.substring(0,10)
                              if (this.recordToSubmit.FechaFactura) this.recordToSubmit.FechaFactura = this.recordToSubmit.FechaFactura.substring(0,10)
                              
                              if (estadoAEAT == "Correcto") {
                                this.$q.notify({ type: 'positive', message: 'Factura y estado AEAT actualizados correctamente.' });
                                    // Opcional: Cerrar el diálogo y la pestaña después de la actualización final
                                    this.$emit('close');
                              }
                            
                            })
                            .catch(error => {
                              this.$q.dialog({ title: 'Error', message: error })
                            })
                        
                        })
                        .catch(error => {
                            this.$q.dialog({ title: 'Error', message: error })
                        })

                    })
                    .catch(error => {
                       
                        this.$q.dialog({ title: 'Error', message: error })
                    })  
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
      
    },

    validacionCliente(record) {
      this.objRecord = {}
      this.nifValidationClass = ''; // Remueve cualquier estilo previo
          
      //hago validacionNIF, nombre, pais, tipoDoc
      this.objRecord = {
        Nombre: '',
        Nif: ''
      };
      
     
      return this.$axios.get(`facturasAEAT/bd_facturasAEAT.php/encontrarCliente`, { params: { idCliente: record.idCliente } })
        .then(response => { 
            
          this.objRecord = {
              Nombre: response.data.nombre,
              Nif: response.data.nroDoc
            };
            console.log()
            this.nacionalidad = response.data.nacionalidad
            this.tipoDoc = response.data.tipoDoc

            if (this.nacionalidad == "") {
              this.$q.dialog({ title: 'El cliente no tiene nacionalidad asignada, añádela para poder generar factura' })
                  // Si hay un error en la validación AEAT, ponlo en rojo
                  this.validacionCli = 'ERROR'
            }
            if (this.tipoDoc == "") {
              this.$q.dialog({ title: 'El cliente no tiene TipoDoc seleccionado, añádelo para poder generar factura' })
                  // Si hay un error en la validación AEAT, ponlo en rojo
                  this.validacionCli = 'ERROR'
            }
           
            if (this.nacionalidad === 'ESP') {
              return this.$axios.get(`SIF/validacionNif.php`, { params: this.objRecord })
                .then(response => {
                    if(response.data == "IDENTIFICADO"){
                      this.nifValidationClass = 'q-select-success';
                      this.$q.notify('Cliente IDENTIFICADO por la AEAT')
                      this.validacionCli = 'OK'
                    } else {
                      this.nifValidationClass = 'q-select-error';
                      this.validacionCli = 'ERROR'
                      this.$q.dialog({
                        title: 'Atención',
                        message: 'Cliente NO IDENTIFICADO por la AEAT. Por favor revise el campo DNI/Pasaporte',
                        ok: {
                          label: 'Aceptar',
                          color: 'primary'
                        },
                        persistent: true // evita que se cierre haciendo clic fuera
                      })
                    }
                  })
                  .catch(error => {
                    this.$q.dialog({ title: 'Error en la Validación AEAT', message: error })
                    // Si hay un error en la validación AEAT, ponlo en rojo
                    this.validacionCli = 'ERROR'
                    this.nifValidationClass = 'q-select-error'; // Establece la clase de error
                  })
              
            } else {
              this.validacionCli = 'OK'
              this.$q.notify('Cliente extranjero - no se valida por la AEAT')
            }
          })
          .catch(error => {
            this.$q.dialog({ title: 'Faltan datos obligatorios del cliente: Nombre, DNI/Pasaporte, TipoDoc o Nacionalidad ', message: error })
            // Si hay un error en la validación AEAT, ponlo en rojo
            this.validacionCli = 'ERROR'
            this.nifValidationClass = 'q-select-error'; // Establece la clase de error
          })

  

    }
  },
  mounted () {
    
    this.listaClientesFilter = this.listaClientes
   this.listaTipoEstanciaFilter = this.listaTipoEstancia
    this.listaFactEmitidasFilter = this.listaNumFactEmitidas
    this.recordToSubmit = Object.assign({}, this.value)
    if (this.recordToSubmit.fechaEntrada) this.recordToSubmit.fechaEntrada = this.recordToSubmit.fechaEntrada.substring(0,10)
    if (this.recordToSubmit.fechaSalida) this.recordToSubmit.fechaSalida = this.recordToSubmit.fechaSalida.substring(0,10)
    if (this.recordToSubmit.FechaFactura) this.recordToSubmit.FechaFactura = this.recordToSubmit.FechaFactura.substring(0,10)
    if (this.recordToSubmit.NroFactura!==null && this.user.login!=='jvilata') { // no dejo modificar campos factura
      this.disableNroFactura = true
    }
    
  },
  watch: {
    recordToSubmit: { // detecta cambios en las propiedades de este objeto (tienen que estar inicializadas en data())
      handler (val) {
        this.$emit('hasChanges', { record: this.recordToSubmit, hasChanges: true, colorBotonSave: 'red' })
      },
      deep: true
    }
  }
}
</script>
