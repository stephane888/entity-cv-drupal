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
    SET_EXPERIENCE(state, payload) {
      state.experience = payload;
    },
    SET_FORMATION(state, payload) {
      state.formation = payload;
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
        id: 1,
        entity_type_id: "model_cv",
      };
      return request
        .bPost("/vuejs-entity/form/get-form/from/entity-id", param, {}, false)
        .then((resp) => {
          // Recuperation du paragraph presentation.
          if (
            resp.data.model &&
            resp.data.model.presentation &&
            resp.data.model.presentation.length
          ) {
            //
            const param2 = {
              id: resp.data.model.presentation[0].target_id,
              entity_type_id: "paragraph",
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
          }
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
