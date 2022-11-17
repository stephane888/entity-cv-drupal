import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
// import bootstrap.
import "./plugins/bootstrap-vue.js";
import buttons from "components_h_vuejs/src/components/Buttons/index.js";
Vue.config.productionTip = false;
Vue.use(buttons);
//
import ContainerPage from "./views/ContainerPage.vue";
Vue.component("ContainerPage", ContainerPage);
//
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
