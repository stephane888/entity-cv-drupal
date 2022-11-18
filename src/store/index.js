import Vue from "vue";
import Vuex from "vuex";
import storeForm from "../formulaires/storeForm";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { storeForm: storeForm },
});
