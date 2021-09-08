// import Vue from 'vue'
// import App from './App.vue'
// import Chakra from '@chakra-ui/vue'

// Vue.use(Chakra)

// Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

import Vue from "vue";
import Chakra, { CThemeProvider, CReset } from "@chakra-ui/vue";
import App from "./App.vue";
import store from "./store";

Vue.use(Chakra);

new Vue({
  store,
  el: "#app",
  render: (h) => h(CThemeProvider, [h(CReset), h(App)]),
}).$mount();
