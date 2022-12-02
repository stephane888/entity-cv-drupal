import request from "../request";
import user from "../User";
import router from "../router/index";
export default {
  namespaced: true,
  state: () => ({
    /**
     * Contient le formulaire de la partie presentation.
     */
    presentaton: {},
    /**
     * Contient le formulaire de la partie Experience.
     */
    experience: {},
    /**
     * Contient le formulaire de la partie formation.
     */
    formation: {},

    /**
     * Contient le formulaire de la partie formation.
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
  }),

  // getters: {
  //   testGet: (state) => {
  //     return state.user;
  //   },
  //   /**
  //    * Les identifiants de champs doivent prevenir du model.
  //    */
  //   SubDomain: (state) => {
  //     if (state.presentaton.model) {
  //       console.log("state.presentaton.model ", state.presentaton.model);
  //       var str = "";
  //       if (
  //         state.presentaton.model.field_email &&
  //         state.presentaton.model.field_email[0] &&
  //         state.presentaton.model.field_email[0].value
  //       )
  //         str += state.presentaton.model.field_email[0].value;
  //       if (
  //         state.presentaton.model.field_phone &&
  //         state.presentaton.model.field_phone[0] &&
  //         state.presentaton.model.field_phone[0].value
  //       )
  //         str += state.presentaton.model.field_phone[0].value;
  //       if (str != "") return str;
  //       else return null;
  //     } else return null;
  //   },
  //   /**
  //    * Les identifiants de champs doivent prevenir du model.
  //    */
  //   GetNom: (state) => {
  //     if (state.presentaton.model) {
  //       var str = null;
  //       if (
  //         state.presentaton.model.field_phone &&
  //         state.presentaton.model.field_phone[0] &&
  //         state.presentaton.model.field_phone[0].value
  //       )
  //         str = state.presentaton.model.field_phone[0].value;
  //       return str;
  //     } else return null;
  //   },
  //   /**
  //    * Les identifiants de champs doivent pro-venir du model.
  //    */
  //   GetPreNom: (state) => {
  //     if (state.presentaton.model) {
  //       var str = null;
  //       if (
  //         state.presentaton.model.field_email &&
  //         state.presentaton.model.field_email[0] &&
  //         state.presentaton.model.field_email[0].value
  //       )
  //         str = state.presentaton.model.field_email[0].value;
  //       return str;
  //     } else return null;
  //   },
  // },

  mutations: {
    SET_PRESENTATION(state, payload) {
      state.presentaton = payload;
      localStorage.setItem("app_cv.presentaton", JSON.stringify(payload));
    },
    SET_EXPERIENCE(state, payload) {
      state.experience = payload;
      localStorage.setItem("app_cv.experience", JSON.stringify(payload));
    },
    SET_FORMATION(state, payload) {
      state.formation = payload;
      localStorage.setItem("app_cv.formation", JSON.stringify(payload));
    },
    SET_HEADER(state, payload) {
      state.entete_paragraph = payload;
      localStorage.setItem("app_cv.entete_paragraph", JSON.stringify(payload));
    },
    SET_FOOTER(state, payload) {
      state.footer_paragraph = payload;
      localStorage.setItem("app_cv.footer_paragraph", JSON.stringify(payload));
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
    SET_VALUE(state, payload) {
      if (payload.fieldName && payload.value && state.presentaton.model) {
        if (state.presentaton.model[payload.fieldName]) {
          state.presentaton.model[payload.fieldName] = payload.value;
        }
      }
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    CLEAN_LOCALSTORAGE() {
      localStorage.removeItem("app_cv.presentaton");
      localStorage.removeItem("app_cv.experience");
      localStorage.removeItem("app_cv.formation");
      localStorage.removeItem("app_cv.entete_paragraph");
      localStorage.removeItem("app_cv.footer_paragraph");
      localStorage.removeItem("app_cv.hash");
    },
  },
  actions: {
    loadForm({ commit }) {
      commit("ACTIVE_RUNNING");
      const param = {
        id: window.location.pathname.split("/").pop(),
        entity_type_id: "model_cv",
      };
      //  on recupere la valeur hash
      const urlParams = new URLSearchParams(window.location.search);
      const hash = urlParams.get("hash");
      // on verifie si on a des données en cache.
      if (
        localStorage.getItem("app_cv.presentaton") &&
        hash == localStorage.getItem("app_cv.hash")
      ) {
        commit(
          "SET_PRESENTATION",
          JSON.parse(localStorage.getItem("app_cv.presentaton"))
        );
        commit(
          "SET_EXPERIENCE",
          JSON.parse(localStorage.getItem("app_cv.experience"))
        );
        commit(
          "SET_FORMATION",
          JSON.parse(localStorage.getItem("app_cv.formation"))
        );
        commit(
          "SET_HEADER",
          JSON.parse(localStorage.getItem("app_cv.entete_paragraph"))
        );
        commit(
          "SET_FOOTER",
          JSON.parse(localStorage.getItem("app_cv.footer_paragraph"))
        );
        // page_supplementaires
        commit(
          "SET_PAGE_SUPP",
          JSON.parse(localStorage.getItem("app_cv.page_supplementaires"))
        );
        commit("DISABLE_RUNNING");
      } else {
        //on se rassure que l'utilisateur est sur la page d'accuiel;
        request
          .bPost("/vuejs-entity/form/get-form/from/entity-id", param, {}, false)
          .then((resp) => {
            if (window.location.hash != "#/presentation") {
              commit("CLEAN_LOCALSTORAGE");
              router.push({ path: `/presentation` });
            }
            commit("DISABLE_RUNNING");
            // Recuperation des pages supplementaires :
            if (resp.data.model && resp.data.model.page_supplementaires) {
              commit("SET_PAGE_SUPP", resp.data.model.page_supplementaires);
            }
            if (
              resp.data.model &&
              resp.data.model.presentation &&
              resp.data.model.presentation.length
            ) {
              // Recuperation du paragraph presentation.
              const param2 = {
                id: resp.data.model.presentation[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param2,
                  {},
                  false
                )
                .then((pres) => {
                  commit("SET_PRESENTATION", pres.data);
                });
              //
              const param3 = {
                id: resp.data.model.experience[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param3,
                  {},
                  false
                )
                .then((pres) => {
                  commit("SET_EXPERIENCE", pres.data);
                });
              //
              const param4 = {
                id: resp.data.model.formation[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param4,
                  {},
                  false
                )
                .then((pres) => {
                  commit("SET_FORMATION", pres.data);
                });
              //
              const param5 = {
                id: resp.data.model.entete_paragraph[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param5,
                  {},
                  false
                )
                .then((res) => {
                  commit("SET_HEADER", res.data);
                });
              //
              const param6 = {
                id: resp.data.model.footer_paragraph[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param6,
                  {},
                  false
                )
                .then((res) => {
                  commit("SET_FOOTER", res.data);
                });

              //
              localStorage.setItem("app_cv.hash", hash);
            }
          })
          .catch(() => {
            commit("DISABLE_RUNNING");
          });
      }
    },
    /**
     * Generate CV.
     * @param {*} param0
     * @returns
     */
    saveEntity({ commit, state }) {
      return new Promise((resolv, reject) => {
        const params = {
          presentaton: state.presentaton,
          experience: state.experience,
          formation: state.formation,
        };
        request
          .bPost("/buildercv/generate-cv", params, {})
          .then((resp) => {
            resolv(resp);
          })
          .catch((er) => {
            reject(er);
          });
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
    updateLocalStorage({ commit, state }) {
      commit("SET_PRESENTATION", state.presentaton);
      commit("SET_EXPERIENCE", state.experience);
      commit("SET_FORMATION", state.formation);
    },
  },
  getters: {
    //
  },
};
