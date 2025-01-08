import { axiosInstance } from 'boot/axios.js'

const state = { 
  listaMunicipios: [],
  listaPaises: []
}

const mutations = {
  loadListaMunicipios (state, lista) {
    state.listaMunicipios = lista
  },
  loadListaPaises (state, lista) {
    state.listaPaises = lista
  }
 }

const actions = {
  
  comboListaMunicipios ({ commit }) {
    axiosInstance.get('ministerioGC/bd_ministerio_guardiac.php/comboListaMunicipios', {}, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadListaMunicipios' + 'No existen datos', { root: true })
        } else {
          commit('loadListaMunicipios', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje' + error, { root: true })
      })
  },
    comboListaPaises ({ commit }) {
      axiosInstance.get('ministerioGC/bd_ministerio_guardiac.php/comboListaPaises', {}, { withCredentials: true }) // tipo acciones
        .then((response) => {
          if (response.data.length === 0) {
            this.dispatch('mensajeLog/addMensaje', 'loadListaPaises' + 'No existen datos', { root: true })
          } else {
            commit('loadListaPaises', response.data)
          }
        })
        .catch(error => {
          this.dispatch('mensajeLog/addMensaje' + error, { root: true })
        })
    },  
  addTipo1 ({ commit }, record) {
    return axiosInstance.get('ministerioGC/bd_ministerio_guardiac.php/guardarBDTipo1', { params: record }, { withCredentials: true })
  },
  addTipo2 ({ commit }, record) {
    return axiosInstance.get('ministerioGC/bd_ministerio_guardiac.php/guardarBDTipoReg2', { params: record }, { withCredentials: true })
  },
  borrarTipo2 ({ commit }, id) {
    return axiosInstance.get('ministerioGC/bd_ministerio_guardiac.php/deleteBDTipoReg2', { params: { id: id } }, { withCredentials: true })
  },
  findTipo1 ({ commit }, record) {
    return axiosInstance.get('ministerioGC/bd_ministerio_guardiac.php/findGCTipo1Filter', { params: record }, { withCredentials: true })
  },
  findTipo2 ({ commit }, record) {
    return axiosInstance.get('ministerioGC/bd_ministerio_guardiac.php/findGCTipoReg2Filter', { params: record }, { withCredentials: true })
  },
  generarArchivoGC ({ commit }) {
    return axiosInstance.get('ministerioGC/bd_ministerio_guardiac.php/generarArchivoGC', { }, { withCredentials: true })
  },
  generarGC ({ commit }, record) {
    return axiosInstance.get('ministerioGC/bd_ministerio_guardiac.php/generarListaGC', { params: record }, { withCredentials: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
