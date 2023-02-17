import Vue from "vue";
import Vuex from "vuex";
import storeForm from "../formulaires/storeForm";
import saveEntity from "./GenerateCv";
import router from "../router/index";
import request from "../request";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**
     * Permet de suivre l'etat de creation du site.
     * True, le site est encours de creation.
     */
    creation_running: false,
    //
    running: false,
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
    // Utilisateur connecter.
    user: {},
    // Contient les textes traduites.
    strings: {},
    //
    messages: { errors: [], warnings: [] },
    // Use by module login.
    form: {
      name: [{ value: "" }],
      mail: [{ value: "" }],
    },
  },
  getters: {
    /**
     * Les identifiants de champs doivent prevenir du model.
     */
    SubDomain: (state) => {
      if (
        state.storeForm.EntitiesForm[0] &&
        state.storeForm.EntitiesForm[0].entities
      ) {
        const presentation =
          state.storeForm.EntitiesForm[0].entities.presentation[0].entity;

        var str = "";
        if (
          presentation.field_email &&
          presentation.field_email[0] &&
          presentation.field_email[0].value
        )
          str += presentation.field_email[0].value;
        if (
          presentation.field_phone &&
          presentation.field_phone[0] &&
          presentation.field_phone[0].value
        )
          str += " " + presentation.field_phone[0].value;

        console.log("SubDomain : ", str);
        if (str != "") return str;
        else return null;
      } else return null;
    },
    /**
     * Les identifiants de champs doivent prevenir du model.
     */
    GetNom: (state) => {
      if (
        state.storeForm.EntitiesForm[0] &&
        state.storeForm.EntitiesForm[0].entities
      ) {
        const presentation =
          state.storeForm.EntitiesForm[0].entities.presentation[0].entity;
        var str = null;
        if (
          presentation.field_phone &&
          presentation.field_phone[0] &&
          presentation.field_phone[0].value
        )
          str = presentation.field_phone[0].value;
        return str;
      } else return null;
    },
    /**
     * Les identifiants de champs doivent pro-venir du model.
     */
    GetPreNom: (state) => {
      if (
        state.storeForm.EntitiesForm[0] &&
        state.storeForm.EntitiesForm[0].entities
      ) {
        var str = null;
        const presentation =
          state.storeForm.EntitiesForm[0].entities.presentation[0].entity;
        if (
          presentation.field_email &&
          presentation.field_email[0] &&
          presentation.field_email[0].value
        )
          str = presentation.field_email[0].value;
        return str;
      } else return null;
    },
    /**
     * Retourne les etapes en fonction des données recus.
     */
    etapes: (state) => {
      if (
        state.storeForm.EntitiesForm[0] &&
        state.storeForm.EntitiesForm[0].entities &&
        state.storeForm.EntitiesForm[0].entities.layout_paragraphs
      ) {
        return Object.keys(
          state.storeForm.EntitiesForm[0].entities.layout_paragraphs
        );
      } else return [];
    },
    /**
     * Semble plus necessaire car...
     * @param {*} state
     * @returns
     */
    modelDynamique: (state) => {
      if (
        router.history.current.params &&
        router.history.current.params.keySections &&
        state.storeForm.layout_paragraphs
      ) {
        console.log(
          "router.history.current.params: ",
          router.history.current.params
        );
        const keySections = router.history.current.params.keySections;
        return state.storeForm.layout_paragraphs[keySections].entity;
      } else return {};
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
    ACTIVE_RUNNING(state) {
      state.running = true;
    },
    DISABLE_RUNNING(state) {
      state.running = false;
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
      console.log("getSubDomain : ", context.getters);
      if (context.getters.SubDomain) return context.getters.SubDomain;
      else throw new "Nom de domaine non definit"();
    },
    saveEntities({ commit, state }) {
      return new Promise((resolv, reject) => {
        commit("ACTIVE_RUNNING");
        generateField
          .getNumberEntities(state.currentEntityForm)
          .then((numbers) => {
            state.run_entity.numbers = numbers;
            generateField
              .prepareSaveEntities(
                this,
                state.currentEntityForm,
                state.run_entity
              )
              .then((resp) => {
                commit("DISABLE_RUNNING");
                resolv(resp);
              })
              .catch((er) => {
                commit("DISABLE_RUNNING");
                reject(er);
              });
          })
          .catch((er) => {
            commit("DISABLE_RUNNING");
            reject(er);
          });
      });
    },
    saveEntity({ commit }, payload) {
      return new Promise((resolv, reject) => {
        commit("ACTIVE_RUNNING");
        if (payload.entity_type_id == undefined || !payload.entity_type_id) {
          reject("Paramettre manquant");
        } else
          request
            .bPost(
              "/apivuejs/save-entity/" + payload.entity_type_id,
              payload.value
            )
            .then((resp) => {
              console.log("resp : ", resp);
              // setTimeout(() => {
              console.log(" payload : ", payload);
              resolv(resp);
              // }, 1000);
            })
            .catch((er) => {
              reject(er);
            });
      });
    },
  },
  modules: { storeForm: storeForm },
});
