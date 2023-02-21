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
    /**
     * Entrée pour les textes.
     */
    string_modal: (state) => {
      const modal = {
        title_button_modal: "Conseils",
        button: "J'ai compris",
        desc_modal: {
          value: "",
        },
        desc_header: {
          value: "",
        },
      };
      if (state.storeForm.strings && state.storeForm.strings.modal) {
        modal.title_button_modal =
          state.storeForm.strings.modal.title_button_modal;
        modal.button = state.storeForm.strings.modal.button;
        modal.desc_modal.value = state.storeForm.strings.modal.desc_modal.value;
        modal.desc_header.value =
          state.storeForm.strings.modal.desc_header.value;
      }
      return modal;
    },
    string_actions: (state) => {
      const actions = {
        buttons_next: "Etape suivante",
        buttons_previews: "Etape precedente",
        create_cv: "Crrer votre CV",
        see_cv: "Voir votre CV",
        admin_cv: "Adminitration de votre CV",
      };
      if (state.storeForm.strings && state.storeForm.strings.actions) {
        actions.buttons_next = state.storeForm.strings.actions.buttons_next;
        actions.buttons_previews =
          state.storeForm.strings.actions.buttons_previews;
        actions.create_cv = state.storeForm.strings.actions.create_cv;
        actions.see_cv = state.storeForm.strings.actions.see_cv;
        actions.admin_cv = state.storeForm.strings.actions.admin_cv;
      }
      return actions;
    },
    strings_presentation: (state) => {
      const presentation = {
        title_box: "Dites-nous en plus sur vous",
        desc_box: {
          value: "",
        },
      };
      if (state.storeForm.strings && state.storeForm.strings.presentation) {
        presentation.title_box = state.storeForm.strings.presentation.title_box;
        presentation.desc_box.value =
          state.storeForm.strings.presentation.desc_box.value;
      }
      return presentation;
    },
    strings_experience: (state) => {
      const experience = {
        title_box: "Expérience professionnelle",
        desc_box: {
          value: "",
        },
      };
      if (state.storeForm.strings && state.storeForm.strings.experience) {
        experience.title_box = state.storeForm.strings.experience.title_box;
        experience.desc_box.value =
          state.storeForm.strings.experience.desc_box.value;
      }
      return experience;
    },
    strings_formation: (state) => {
      const formation = {
        title_box: "Expérience professionnelle",
        desc_box: {
          value: "",
        },
      };
      if (state.storeForm.strings && state.storeForm.strings.formation) {
        formation.title_box = state.storeForm.strings.formation.title_box;
        formation.desc_box.value =
          state.storeForm.strings.formation.desc_box.value;
      }
      return formation;
    },
    strings_createpage: (state) => {
      const createpage = {
        title_box: "Creer votre CV",
        desc_box: {
          value: "",
        },
      };
      if (state.storeForm.strings && state.storeForm.strings.createpage) {
        createpage.title_box = state.storeForm.strings.createpage.title_box;
        createpage.desc_box.value =
          state.storeForm.strings.createpage.desc_box.value;
      }
      return createpage;
    },
    strings_steps: (state) => {
      if (state.storeForm.strings && state.storeForm.strings.steps) {
        const steps = state.storeForm.strings.steps;
        state.build_steps.forEach((item, i) => {
          if (steps[item.step]) state.build_steps[i].titre = steps[item.step];
        });
      }
      return state.build_steps;
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
