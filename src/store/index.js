import Vue from "vue";
import Vuex from "vuex";
import storeForm from "../formulaires/storeForm";
import saveEntity from "./GenerateCv";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**
     * Permet de suivre l'etat de creation du site.
     * True, le site est encours de creation.
     */
    creation_running: false,
    // Permet de determiner si la creation est terminé.
    finish_status: false,
    // Nouveau nom de domaine.
    new_hostname: null,
    // Les differences etapes du processus.
    build_steps: [
      {
        titre: "Creation de votre domaine",
        step: "create_domaine",
        status: false,
      },
      {
        titre: "Enregistrement de votre domaine",
        step: "register_domaine",
        status: false,
      },
      {
        titre: "Creation de vos contenus + CV",
        step: "create_content",
        status: false,
      },
      {
        titre: "Creation de votre theme",
        status: false,
        step: "create_theme",
      },
      {
        titre: "Creation de l'entete",
        status: false,
        step: "layout_header",
      },
      {
        titre: "Creation du footer",
        status: false,
        step: "layout_footer",
      },
      {
        titre: "Genere les styles du theme",
        status: false,
        step: "generate_style",
      },
    ],
    // utilisateur connecter.
    user: {},
    // Contient les textes traduites.
    strings: {},
    //
    messages: { errors: [], warnings: [] },
  },
  getters: {
    /**
     * Les identifiants de champs doivent prevenir du model.
     */
    SubDomain: (state) => {
      if (state.storeForm.presentaton.model) {
        var str = "";
        if (
          state.storeForm.presentaton.model.field_email &&
          state.storeForm.presentaton.model.field_email[0] &&
          state.storeForm.presentaton.model.field_email[0].value
        )
          str += state.storeForm.presentaton.model.field_email[0].value;
        if (
          state.storeForm.presentaton.model.field_phone &&
          state.storeForm.presentaton.model.field_phone[0] &&
          state.storeForm.presentaton.model.field_phone[0].value
        )
          str += " " + state.storeForm.presentaton.model.field_phone[0].value;
        if (str != "") return str;
        else return null;
      } else return null;
    },
    /**
     * Les identifiants de champs doivent prevenir du model.
     */
    GetNom: (state) => {
      if (state.storeForm.presentaton.model) {
        var str = null;
        if (
          state.storeForm.presentaton.model.field_phone &&
          state.storeForm.presentaton.model.field_phone[0] &&
          state.storeForm.presentaton.model.field_phone[0].value
        )
          str = state.storeForm.presentaton.model.field_phone[0].value;
        return str;
      } else return null;
    },
    /**
     * Les identifiants de champs doivent pro-venir du model.
     */
    GetPreNom: (state) => {
      if (state.storeForm.presentaton.model) {
        var str = null;
        if (
          state.storeForm.presentaton.model.field_email &&
          state.storeForm.presentaton.model.field_email[0] &&
          state.storeForm.presentaton.model.field_email[0].value
        )
          str = state.storeForm.presentaton.model.field_email[0].value;
        return str;
      } else return null;
    },
    /**
     * Les identifiants de champs doivent provenir du model.
     */
    etapes: (state) => {
      return Object.keys(state.storeForm.layout_paragraphs);
    },
  },
  mutations: {
    ACTIVE_CREATION(state) {
      state.creation_running = true;
    },
    DISABLE_CREATION(state) {
      state.creation_running = false;
    },
    ACTIVE_FINISH(state) {
      state.finish_status = true;
    },
    SET_HOSTNAME(state, payload) {
      if (payload.domain && payload.scheme) {
        state.new_hostname = payload.scheme + "://" + payload.domain;
      }
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_STRINGS(state, strings) {
      state.strings = strings;
    },
    SET_WARNING_MESSAGES(state, messages) {
      state.messages.warnings = messages;
    },
    SET_ERROR_MESSAGES(state, messages) {
      state.messages.errors = messages;
    },
  },
  actions: {
    //
    create_site_cv({ commit, state }) {
      commit("ACTIVE_CREATION");
      saveEntity.runStep(state.build_steps, state);
    },
    //
    reset_creation({ commit }) {
      commit("DISABLE_CREATION");
      saveEntity.currentBuildStep = 0;
    },
    // Load strings texte
    loadStrings({ commit }) {
      return config.get("/buildercv/default-string").then((resp) => {
        if (resp.data) {
          commit("SET_STRINGS", resp.data);
        }
      });
    },
    getSubDomain(context) {
      if (context.getters.SubDomain) return context.getters.SubDomain;
      else throw new "Nom de domaine non definit"();
    },
  },
  modules: { storeForm: storeForm },
});
