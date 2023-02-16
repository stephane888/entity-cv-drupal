import request from "../request";
import user from "../User";
import router from "../router/index";
import generateField from "components_h_vuejs/src/js/FormUttilities";
import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
export default {
  namespaced: true,
  state: () => ({
    /**
     * Contient le formulaire de la partie entete.
     */
    entete_paragraph: {},
    /**
     *
     */
    page_supplementaires: [],
    /**
     * footer_paragraph
     */
    footer_paragraph: {},

    //
    running: false,
    //
    user: {},
    /**
     * Suit la construction des formualires.
     */
    building_fields: false,
    /**
     *  Permet de definir un temps moyen pour la constructin d'un formulaire.
     */
    RunBuildingForm: {
      time: 3000,
      timeout: null,
    },
    /**
     * Contient les données de tous le formulaire.
     */
    EntitiesForm: [],
  }),
  mutations: {
    SET_HEADER(state, payload) {
      state.entete_paragraph = payload;
      localStorage.setItem("app_cv.entete_paragraph", JSON.stringify(payload));
    },
    SET_FOOTER(state, payload) {
      state.footer_paragraph = payload;
      localStorage.setItem("app_cv.footer_paragraph", JSON.stringify(payload));
    },
    SET_EntitiesForm(state, payload) {
      state.EntitiesForm = payload;
      localStorage.setItem("app_cv.entities_form", JSON.stringify(payload));
    },

    SET_PAGE_SUPP(state, payload) {
      state.page_supplementaires = payload;
      localStorage.setItem(
        "app_cv.page_supplementaires",
        JSON.stringify(payload)
      );
    },
    ACTIVE_RUNNING(state) {
      state.running = true;
    },
    DISABLE_RUNNING(state) {
      state.running = false;
    },
    // https://stackoverflow.com/questions/64635384/write-data-to-a-nested-dictionary-given-a-key-path-of-unknown-length/64641327#64641327.
    // https://stackoverflow.com/questions/66236245/multi-level-dynamic-key-setting.
    // https://lodash.com/docs/4.17.15#update
    // il faudra faire un tuto
    SET_VALUE(state, payload) {
      console.log(" SET_VALUE payload ", payload);
      function updateSettings(settings, keyPath, value) {
        const keys = keyPath.split(".");
        const targetKey = keys.pop();
        let current = settings;
        for (let i = 0; i < keys.length; ++i) {
          current = current[keys[i]];
          if (!current) {
            throw new Error(" Specified key not found. " + keys[i]);
          }
        }
        current[targetKey] = value;
      }
      updateSettings(state.EntitiesForm, payload.fieldName, payload.value);
    },

    SET_USER(state, payload) {
      state.user = payload;
    },
    CLEAN_LOCALSTORAGE() {
      localStorage.removeItem("app_cv.entete_paragraph");
      localStorage.removeItem("app_cv.footer_paragraph");
      localStorage.removeItem("app_cv.entities_form");
      localStorage.removeItem("app_cv.hash");
    },
    /**
     * il est assez complique de suivre, la construction d'un formulaire;
     * donc, on va fixer une valeur de 3s par appel.
     * @param {*} state
     */
    RUN_BUILDING_FIELDS(state) {
      state.building_fields = true;
      clearTimeout(state.RunBuildingForm.timeout);
      state.RunBuildingForm.timeout = setTimeout(() => {
        state.building_fields = false;
      }, state.RunBuildingForm.time);
    },
  },
  actions: {
    loadForm({ commit, state, dispatch }) {
      commit("ACTIVE_RUNNING");
      const param = {
        id: window.location.pathname.split("/").pop(),
        entity_type_id: "model_cv",
      };
      request
        .bPost("/vuejs-entity/form/get-form/from/entity-id", param, {}, false)
        .then((resp) => {
          console.log("loadForm : ", resp.data[0]);
          commit("DISABLE_RUNNING");
          commit("SET_EntitiesForm", resp.data);
          setTimeout(() => {
            const entities = resp.data[0].entities;
            // Recuperation des pages supplementaires :
            if (
              resp.data[0].entity &&
              resp.data[0].entity.page_supplementaires
            ) {
              commit("SET_PAGE_SUPP", resp.data[0].entity.page_supplementaires);
            }

            // Recuperation de l'entete.
            if (entities.entete_paragraph) {
              commit("SET_HEADER", entities.entete_paragraph);
            }
            // Recuperation du footer.
            if (entities.footer_paragraph) {
              commit("SET_FOOTER", entities.footer_paragraph);
            }
          }, 200);
        });
    },
    // Permet de mettre à jour un champs ...
    setValue({ commit }, payload) {
      commit("SET_VALUE", payload);
    },
    /**
     * Check-if user is login.
     */
    checkStatusUser({ commit }) {
      user.getCurrentUser().then((user) => {
        commit("SET_USER", user);
      });
    },
  },
  getters: {
    //
  },
};
