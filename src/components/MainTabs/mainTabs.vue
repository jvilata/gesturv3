<template>
    <div>
    <q-card class="flat">
        <q-tabs
          v-model="localTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-route-tab v-for="(tab, index) in tabs" :key="index" :name="tab.params.id" :label="tab.label" :to="tab"  />
        </q-tabs>

        <q-separator />
        <q-tab-panels v-model="localTab" animated>
          <q-tab-panel v-for="(tab, index) in tabs" :key="index" :name="tab.params.id"  class="q-pa-none">
            <router-view
              @changeTab="(value) => updateTabData([tab, value])"
              @close="removeTab(tab)"
              @contadorAcciones="(value) => $emit('contadorAcciones', value)"/>
          </q-tab-panel>
        </q-tab-panels>
    </q-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState('tabs', ['tabs', 'ltab']),
    localTab: {
      get () {
        return this.ltab
      },
      set (value) {
        this.setltab(value)
      }
    }
  },
  methods: {
    ...mapActions('tabs', ['addTab', 'updateTabData', 'removeTab', 'setltab'])
  }
}
</script>
