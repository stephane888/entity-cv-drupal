import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
// import bootstrap.
import "./plugins/bootstrap-vue.js";
Vue.config.productionTip = false;
//
import buttons from "components_h_vuejs/src/components/Buttons/index.js";
import cards from "components_h_vuejs/src/components/Cards/index.js";
Vue.use(buttons);
Vue.use(cards);
//
import ContainerPage from "./views/ContainerPage.vue";
Vue.component("ContainerPage", ContainerPage);
//
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
