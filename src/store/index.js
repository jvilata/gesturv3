import { store } from "quasar/wrappers";
import { createStore } from "vuex";

// todos los stores que queramos usar en la app deben importarse aqui y listarlos abajo en modules
import login from './store-login'
import tabs from './store-tabs'
import clientes from './store-clientes'
import servicios from './store-servicios'
import estancias from './store-estancias'
import tablasAux from './store-tab-aux'
import tarifas from './store-tarifas'
import facturas from './store-facturas'
import gastos from './store-gastos'
import cuadrecaja from './store-cuadrecaja'
import guardiaC from './store-guardiaC'
import ministerioGC from './store-ministerioGC'
import usuarios from './store-usuarios'
import viajeros from './store-viajeros'
import prereservas from './store-prereservas'
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      login,
      tabs,
      clientes,
      servicios,
      estancias,
      tablasAux,
      tarifas,
      facturas,
      gastos,
      cuadrecaja,
      guardiaC,
      ministerioGC,
      usuarios,
      viajeros,
      prereservas
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
