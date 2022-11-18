import request from "../request";
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
    //
    running: false,
  }),
  mutations: {
    SET_PRESENTATION(state, payload) {
      state.presentaton = payload;
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
  },
  actions: {
    loadForm({ commit }) {
      commit("ACTIVE_RUNNING");
      const param = {
        // homepage: window.location.pathname.split("/").pop(),
        homepage: 1,
      };
      return request
        .bPost("/vuejs-entity/form/model_cv/default/model_cv", param)
        .then((resp) => {
          commit("SET_PRESENTATION", resp.data);
        });
    },
    saveEntity({ commit, state }) {
      return new Promise((resolv, reject) => {
        request
          .saveEntity(
            state.currentProject,
            "app_project_type",
            "app_project_type"
          )
          .then((resp) => {
            console.log("resp : ", resp);
            if (!state.currentProject.uuid)
              commit("ADD_PROJECT", {
                entity: resp.data,
                entity_type_id: "app_project_type",
              });
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
  },
  getters: {
    //
  },
};
